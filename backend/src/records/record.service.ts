import { CreateRecordData, Record, RecordID } from './record.model';
import { getActiveEventDetails, getActiveEventId, getOrganisationDetails } from '../organisations/organisation.service';
import { createRecord, updateStatus, findRecordsByConversationId, findRecordById } from './record.database';
import { listAllPlaceSummaries } from '../places/place.service';
import { ConversationID } from '../conversations/conversation.model';
import { NotFoundError } from '../utils/errors';
import { getFileStreamFromFTP } from '../utils/sftp';
import SFTPClient from 'ssh2-sftp-client';
import { downloadFileFromFTP } from '../utils/sftp';
import {
  createConversation,
  getConversation,
  getLastConversations,
  updateConversation,
} from '../conversations/conversation.service';
import { listAllTeamSummaries } from '../teams/team.service';
import { listAllMemberSummaries } from '../teams/member.service';
import { Conversation, Criticality, MessageContent, SimpleMessage } from '../conversations/conversation.model';
import { addMessageToConversation, listAllMessageTextsForConversation } from '../conversations/message.service';
import { CanalID } from '../canals/canal.model';
import { Member, MemberID, Team } from '../teams/team.model';
import { Place } from '../places/place.model';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { getOrganisation } from '../organisations/organisation.database';

dotenv.config();

const referenceConversation: { conversation: Conversation, messages: SimpleMessage[] } = {
  conversation: {
    conversationId: 'conversation-id-001',
    eventId: 'event-id-001',
    canalID: 'canal-id-001',
    memberIds: [],
    summary: 'SUMMARY\n',
    criticality: 'low',
    createdAt: '2026-07-11T16:02:10.704Z',
    updatedAt: '2026-07-11T16:02:10.704Z',
  } as Conversation,
  messages: [
    { text: "Pour Jabi pour Jabi de CECO répond", sentAt: "2026-07-11T16:02:11.000Z" },
    { text: "Jabi j'écoute", sentAt: "2026-07-11T16:02:12.000Z" },
    { text: "Tu peux venir à l'entrepôt récupérer un câble électrique ?", sentAt: "2026-07-11T16:02:14.000Z" },
    { text: "Oui je peux venir dans 5 minutes", sentAt: "2026-07-11T16:02:18.000Z" },
    { text: "Merci, à tout de suite. Terminé", sentAt: "2026-07-11T16:02:19.000Z" },
  ] as SimpleMessage[]
};

/**
 * Extrait la date et l'heure du nom de fichier au format YYYY-MM-DD_HH-MM-SS
 * Exemple: canal_2_echange_canal_2_2026-07-11_02-37-44.wav
 * @param fileName Le nom du fichier
 * @returns La date extraite ou null si le format ne correspond pas
 */
function extractDateFromFileName(fileName: string): Date | null {
  // Pattern pour capturer YYYY-MM-DD_HH-MM-SS
  const datePattern = /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/;
  const match = fileName.match(datePattern);
  
  if (!match) {
    return null;
  }
  
  const [, year, month, day, hour, minute, second] = match;
  
  // Vérifier que toutes les captures sont définies
  if (!year || !month || !day || !hour || !minute || !second) {
    return null;
  }
  
  // Créer la date (les mois sont 0-indexed en JavaScript)
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10)
  );
  
  // Vérifier que la date est valide
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
}

export async function addRecord(
  data: CreateRecordData,
): Promise<Record> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }

  // Extraire la date du nom de fichier si présente
  const extractedDate = extractDateFromFileName(data.fileName);
  
  if (extractedDate) {
    console.log(`Date extraite du nom de fichier ${data.fileName}: ${extractedDate.toISOString()}`);
  } else {
    console.log(`Aucune date trouvée dans le nom de fichier ${data.fileName}, utilisation de la date actuelle`);
  }

  return await createRecord(activeEventId, data, extractedDate);
}

export async function getRecordsByConversationId(conversationId: ConversationID): Promise<Record[]> {
  return await findRecordsByConversationId(conversationId);
}

export async function getRecordAudioStream(recordId: RecordID): Promise<{ stream: NodeJS.ReadableStream; sftp: SFTPClient; fileName: string; mimeType: string }> {
  const record = await findRecordById(recordId);
  
  if (!record) {
    throw new NotFoundError(`Record with id ${recordId} not found`);
  }

  const remotePath = `default/${record.fileName}`;
  const { stream, sftp } = await getFileStreamFromFTP(remotePath);

  const extension = record.fileName.split('.').pop()?.toLowerCase();
  let mimeType = 'audio/mpeg';
  
  switch (extension) {
    case 'wav':
      mimeType = 'audio/wav';
      break;
    case 'mp3':
      mimeType = 'audio/mpeg';
      break;
    case 'm4a':
      mimeType = 'audio/mp4';
      break;
  }

  return { stream, sftp, fileName: record.fileName, mimeType };
}

// TODO Ajouter des tests sur la base des enregistrements réels pour tester les traitement LLMs
export async function processRecord(
  record: Record,
): Promise<void> {
  const organisation = await getOrganisationDetails();
  const activeEvent = await getActiveEventDetails();
  const officialPlaces = await listAllPlaceSummaries();
  const officialTeams = await listAllTeamSummaries();
  const officialMembers = await listAllMemberSummaries();

  const allPlaceNames = officialPlaces.map(place => place.name!);
  const allTeamNames = officialTeams.map(team => team.name!);
  const allMemberNames = officialMembers.map(member => [ member.name!, ...(member.surnames || []) ].join(' '));

  const transcriptionPrompt = `L'application est RadioLog (configurée en français).
  Le festival est ${activeEvent?.name} et l'organisation est ${organisation.name}.
  Lieux officiels (places) : ${allPlaceNames.join(', ')}.
  Équipes officielles (teams) : ${allTeamNames.join(', ')}.
  Membres officiels (members) : ${allMemberNames.join(', ')}.
  `;
  console.log(transcriptionPrompt);

  await updateStatus(record.id, 'processing');

  const extension = record.fileName.split('.').pop();
  const localFileUrl = `${record.id}.${extension}`;

  try {
    if (extension !== 'wav' && extension !== 'mp3' && extension !== 'm4a') {
      console.warn(`Unsupported file extension: ${extension}. Skipping transcription.`);
      return await updateStatus(record.id, 'failed');
    }

    await downloadFileFromFTP(`default/${record.fileName}`, localFileUrl);

    const transcription = await retrieveTranscription(localFileUrl, transcriptionPrompt);
    console.log(transcription);

    if (!transcription) {
      return await updateStatus(record.id, 'failed');
    }

    // TODO filter test radio message

    const conversation = await getConversationFromLLM(record.canalID, transcription);
    console.log(conversation);

    // TODO Split if multiple messages are in same transcription

    const previousMessages = await listAllMessageTextsForConversation(conversation.conversationId);

    const messageContents = await getMessageContentFromLLM(transcriptionPrompt, previousMessages, transcription);

    const fromMemberId = await getMemberIdFromLLM(conversation, messageContents);

    // Utiliser la date du record (qui peut avoir été extraite du nom de fichier)
    await addMessageToConversation(record.id, conversation.conversationId, messageContents, fromMemberId, record.createdAt);
    const allMessages = [
      ...previousMessages.map(message => message.text),
      messageContents.map(content => content.text).join(' ')
    ];

    const criticality = await getCriticalityFromLLM(allMessages);
    const summary = await getSummaryFromLLM(allMessages);

    await updateConversation(conversation.conversationId, messageContents, summary, criticality);

    await updateStatus(record.id, 'completed');

  } catch (error) {
    console.error(error);
    await updateStatus(record.id, 'failed');
  }

  fs.unlink(localFileUrl, (err) => {
    if (err) {
      console.error(`Failed to delete temporary file ${localFileUrl}:`, err);
    } else {
      console.log(`Temporary file ${localFileUrl} deleted successfully.`);
    }
  });
}

async function getConversationFromLLM(canalID: CanalID, transcription: string): Promise<Conversation> {
  const lastConversations = await getLastConversations(canalID, 1);
  const lastConversation = lastConversations.length ? lastConversations[0] : null;
  console.log(lastConversation);

  const CONVERSATION_INSTRUCTION = `
You are an AI assistant that analyzes French walkie-talkie style conversations and determines whether a new message belongs to an existing conversation or should start a new one.
last conversation (or null):
${lastConversation ? JSON.stringify(lastConversation) : "null"}

Conversation contains past messages. Use them to infer context, time, participants, and intent.

# Objective
Given a new incoming message, decide:
- If it continues an existing conversation (preferred) → return its conversationId
- Otherwise → return "new"

# Key heuristics
1. Conversation continuity (priority rule):
  - If the latest messages of the conversation do NOT contain a clear conclusion, prioritize linking the new message to that conversation.
  - The conversation is considered "concluded" if it contains:
    - A clear answer to a question
    - A validation or acknowledgment of a request
    - The word "terminé"
    - A general announcement (broadcast style)

2. Message structure (walkie-talkie patterns):
  - Typical patterns include:
    - "De [source] pour [target], répondez" (first message of a conversation):
    - "[target], j'écoute"
    - "... répondez"
    - "... terminé" (last message of a conversation):

3. New conversation:
  - If the new message starts with an explicit target (person or team name) , it may indicate a new conversation.
  - If it is a general announcement (broadcast style), it may also start a new conversation.
  - Otherwise, if there is no explicit addressee at the beginning, prioritize continuing the ongoing (non-concluded) conversation.

# Typical complete conversation and message look like:
${ JSON.stringify(referenceConversation) }

# Output format
Return a JSON object:
{
"conversationId": "existing-conversation-id" | "new"
}
Only return the JSON. No explanation.`;
  const conversationResponse = await askLLM<{ conversationId: string }>(CONVERSATION_INSTRUCTION, transcription);
  console.log(conversationResponse);

  if (conversationResponse.conversationId === "new") {
    return await createConversation(canalID, transcription);
  } else {
    return await getConversation(conversationResponse.conversationId);
  }
}

async function getMessageContentFromLLM(generalInformation: string, messages: SimpleMessage[], transcription: string): Promise<MessageContent[]> {
  const CONTENT_INSTRUCTION = `
You are an AI assistant that analyzes conversations in French, fixes issues and identifies mentions of places, teams and members even when it is partially correct.
${generalInformation}

Previous messages are: ${JSON.stringify(messages)}
Please identify all the places, teams, and members mentioned in the following message and return the message as a JSON array of Content.

Content {
  placeId: // PlaceID (if the place is found, otherwise omit this field),
  teamId: // TeamID (if the team is found, otherwise omit this field),
  memberId: // MemberID (if the member is found, otherwise omit this field),
  text: string;
}

You can fix transcription issues in following messages  .

Example of response for message: "Il faudrait envoyer Ludo de l'équipe des électros du côté de l'entrepôt pour récupérer un câble électrique"
messageContents: The JSON format should be as follows:
{
  "messageContents": [
    {
      "text": "Il faudrait envoyer"
    },
    {
      "memberId": "member-id-001",
      "text": "Ludo"
    },
    {
      "text": "de l'équipe des"
    },
    {
      "teamId": "team-id-001",
      "text": "électriciens"
    },
    {
      "text": "du côté de"
    },
    {
      "placeId": "place-id-001",
      "text": "l'entrepôt de stockage"
    },
    {
      "text": "pour récupérer un câble électrique"
    }
  ]
}
Only return the JSON. No explanation.`;
  const messageContents = await askLLM<{ messageContents: MessageContent[] }>(CONTENT_INSTRUCTION, transcription);
  console.log(messageContents);

  if (!messageContents || !messageContents.messageContents || !messageContents.messageContents.length) {
    throw new Error("Failed to extract message contents from transcription.");
  }
  return messageContents.messageContents;
}

async function getMemberIdFromLLM(conversation: Conversation, messageContents: MessageContent[]): Promise<MemberID | undefined> {
  const MEMBER_INSTRUCTION = `
You are an AI assistant that analyzes conversations in French and identifies the member who sent the message based on the conversation context and the message contents.
The conversation context is: ${JSON.stringify(conversation)}.
The message contents are: ${JSON.stringify(messageContents)}.
Please identify the member who sent the message and return the member ID if found, otherwise return empty value
Return JSON object with the following format:
{
  "memberId": "member-id" | ""
}
Only return the JSON. No explanation.`;
  const memberResponse = await askLLM<{ memberId: MemberID | "" }>(MEMBER_INSTRUCTION, JSON.stringify(messageContents));
  console.log(memberResponse);

  return memberResponse.memberId || undefined;
}

async function getCriticalityFromLLM(messages: string[]): Promise<Criticality> {
  const CRITICITY_INSTRUCTION = `
You are an AI assistant that analyzes conversations in French and determines their criticality level.
The criticality levels are defined as follows:
- Low: The conversation is routine, non-urgent, and does not require immediate attention.
- Medium: The conversation contains some issues that may need attention but are not urgent.
- High: The conversation contains urgent issues that require immediate attention.

Please analyze the following conversation and provide a JSON response with the criticality level. The JSON format should be as follows:
{
  "criticality": "low" | "medium" | "high"
}
Only return the JSON. No explanation.`;
  const criticalityResponse = await askLLM<{ criticality: Criticality }>(CRITICITY_INSTRUCTION, messages.join('\n'));
  console.log(criticalityResponse);

  return criticalityResponse.criticality;
}

async function getSummaryFromLLM(messages: string[]): Promise<string> {
  const SUMMARY_INSTRUCTION = `
You are an AI assistant that analyzes conversations in French and provides a concise summary of the conversation in 1-2 sentences even if the conversation is one sentence.
The JSON format should be as follows:
{
  "summary": "string"
}
Only return the JSON. No explanation.`;
  const summaryResponse = await askLLM<{ summary: string }>(SUMMARY_INSTRUCTION, messages.join('\n'));
  console.log(summaryResponse);
  return summaryResponse.summary;
}

async function retrieveTranscription(localFileUrl: string, whisperPromptContext = ""): Promise<string> {
  const file = fs.readFileSync(localFileUrl);
  const fileBlob = new Blob([file]);

  const formData = new FormData();
  formData.append('file', fileBlob, localFileUrl);
  formData.append('model', 'whisper');
  formData.append('language', 'fr');
  formData.append('response_format', 'text');

  if (whisperPromptContext) {
    formData.append('prompt', whisperPromptContext);
  }

  const response = await fetch(`https://api.infomaniak.com/1/ai/${process.env.IA_PRODUCT_ID}/openai/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.IA_TOKEN}` },
    body: formData
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Erreur HTTP ${response.status} : ${bodyText}`);
  }

  const body = await response.text();
  const data = JSON.parse(body);
  if (!!data.batch_id) {
    return checkResult(data.batch_id || data.text || body)
  }
  return data.text || body;
}

async function askLLM<T>(instruction: string, context: string): Promise<T> {
  const response = await fetch(`https://api.infomaniak.com/2/ai/${process.env.IA_PRODUCT_ID}/openai/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.IA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({

      "model": "qwen3",
      "messages": [
        { "role": "system", "content": instruction },
        { "role": "user", "content": context }
      ]
    })
  });

  const data = await response.json();
  const cleanContent = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanContent);
}

function checkResult(batchId: string): Promise<string> {
  if (!batchId || batchId.length > 50 || batchId.includes(' ')) return Promise.resolve(batchId);

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const maxAttempts = 40;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        return reject(new Error("Timeout de transcription."));
      }
      try {
        const response = await fetch(`https://api.infomaniak.com/1/ai/${process.env.IA_PRODUCT_ID}/results/${batchId}`, {
          headers: { Authorization: `Bearer ${process.env.IA_TOKEN}` }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();

        if (result.status === "success") {
          clearInterval(interval);
          resolve(result.data.result || result.data);
        } else if (result.status === "error" || result.status === "failed") {
          clearInterval(interval);
          reject(new Error("Échec de la transcription côté serveur."));
        }
      } catch (err) {
        console.log(`Vérification en attente...`);
      }
    }, 3000);
  });
}