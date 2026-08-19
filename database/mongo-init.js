// Script d'initialisation de la base de données MongoDB pour RadioLog
// Ce script sera exécuté automatiquement lors du démarrage du conteneur MongoDB
db = db.getSiblingDB('radiolog');

db.organisations.deleteMany({});
db.users.deleteMany({});
db.events.deleteMany({});
db.canals.deleteMany({});
db.places.deleteMany({});
db.teams.deleteMany({});
db.radios.deleteMany({});
db.conversations.deleteMany({});
db.members.deleteMany({});
db.messages.deleteMany({});
db.records.deleteMany({});

print("Toutes les collections ont été vidées");

const organisationId = ObjectId();
const mainTeamId = ObjectId();
const firstUserId = ObjectId();
// const secondUserId = ObjectId();
// const thirdUserId = ObjectId();
const activeEventId = ObjectId();
// const firstConversationId = ObjectId();
// const secondConversationId = ObjectId();
// const thirdConversationId = ObjectId();
// const placeCategoryId = ObjectId();
// const incidentPlaceId = ObjectId();

// Collection: organisations
db.organisations.insertOne({
  _id: organisationId,
  activeEventId,
  name: "Pleins-les-Watts",
  description: "Association organisatrice du festival Pleins-les-Watts",
  timezone: "Europe/Zurich",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  createdById: firstUserId,
  updatedById: firstUserId
});

// Collection: users
db.users.insertMany([
  {
    _id: firstUserId,
    auth0Id: "auth0|69a5b8d3a37f11bb4e72a242", // Jeremy Gobet
    email: "jeremy.gobet@hesge.ch",
    isAdmin: true,
    lastLoginAt: "2026-02-18",
    organisationId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    auth0Id: "auth0|69a7ee45951aee29544ff30a", // Antoine Sutter
    email: "antoine.sutter@hesge.ch",
    isAdmin: true,
    lastLoginAt: "2026-02-17",
    organisationId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    auth0Id: "auth0|69b01af20a495d1bf4336dfd", // Christophe Fracheboud
    email: "christophe.fracheboud@hesge.ch",
    isAdmin: true,
    lastLoginAt: "2026-02-14",
    organisationId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
]);
// Collection: events
db.events.insertOne({
  _id: activeEventId,
  organisationId,
  name: "PLW 2026",
  description: "La 8e edition de Pleins-les-Watts",
  location: "Parc Navazza-Oltramare, Lancy, Switzerland",
  startAt: "2026-07-09T12:00:00Z",
  endAt: "2026-07-11T12:00:00Z",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  createdById: firstUserId,
  updatedById: firstUserId
});

// Collection: canals
db.canals.insertMany([
  {
    number: 1,
    name: "F&B / Information",
    description: "Food & Beverage et stand d'information",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    number: 2,
    name: "Artistes",
    description: "Coordination des artistes et des performances",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    number: 3,
    name: "Infrastructure",
    description: "Infrastructure et logistique",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    number: 4,
    name: "Sécurité",
    description: "Sécurité et gestion des foules",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    number: 5,
    name: "Dégagement",
    description: "Cannal de dégagement pour les urgences et les situations imprévues",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    number: 6,
    name: "Spare",
    description: "",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }
]);

const sceneId = ObjectId();
const standId = ObjectId();
const backstageId = ObjectId();
const toiletteId = ObjectId();
const barId = ObjectId();
const entreeId = ObjectId();

db.categories.insertMany([
  {
    _id: sceneId,
    name: "Scène"
  },
  {
    _id: standId,
    name: "Stand"
  },
  {
    _id: backstageId,
    name: "Backstage"
  },
  {
    _id: toiletteId,
    name: "Toilette"
  },
  {
    _id: barId,
    name: "Bar"
  },
  {
    _id: entreeId,
    name: "Entrée"
  },
]);

// Collection: places
// TODO Update long et lat
const places = [
  "Bar GE", barId, 46.184145, 6.114949,
  "Bar Hill", barId, 46.184150, 6.114950,
  "Bara Kwa", barId, 46.184155, 6.114955,
  "Barbylone", barId, 46.184160, 6.114960,
  "Entrée", entreeId, 46.184165, 6.114965,
  "Infra-Bar", barId, 46.184170, 6.114970,
  "Merchandising", standId, 46.184175, 6.114975,
  "Scène principale", sceneId, 46.184180, 6.114980,
  "Scène secondaire", sceneId, 46.184185, 6.114985,
];
db.places.insertMany(places.map(place => ([
  {
    eventId: activeEventId,
    categoryId: place[1],
    name: place[0],
    description: "",
    latitude: place[2],
    longitude: place[3],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }
])));

/*const standFB = db.places.findOne({ name: "Stand F&B" });
const VIPentrée = db.places.findOne({ name: "Entrée VIP" });
const scenePrincipale = db.places.findOne({ name: "Scène principale" });

db.conversations.insertMany([
  {
    _id: firstConversationId,
    eventId: activeEventId,
    canalID: db.canals.findOne({ number: 1 })._id,
    memberIds: [firstUserId, secondUserId],
    summary: "Approvisionnement en eau - Stand F&B principal",
    createdAt: "2025-06-01T10:05:00Z",
    updatedAt: "2025-06-01T10:25:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    _id: secondConversationId,
    eventId: activeEventId,
    canalID: db.canals.findOne({ number: 1 })._id,
    memberIds: [firstUserId, thirdUserId],
    summary: "Panne système de paiement - Stand principal",
    createdAt: "2025-06-01T11:15:00Z",
    updatedAt: "2025-06-01T11:35:00Z",
    createdById: firstUserId,
    updatedById: thirdUserId
  },
  {
    _id: thirdConversationId,
    eventId: activeEventId,
    canalID: db.canals.findOne({ number: 2 })._id,
    memberIds: [secondUserId, thirdUserId],
    summary: "URGENT: Artiste principal bloqué - Scène principale",
    createdAt: "2025-06-01T14:45:00Z",
    updatedAt: "2025-06-01T14:57:00Z",
    createdById: secondUserId,
    updatedById: secondUserId
  }
]);
const firstStatusId = ObjectId();
const secondStatusId = ObjectId();
const thirdStatusId = ObjectId();

db.status.insertMany([
  {
    _id: firstStatusId,
    resolve: true,
    description: "Incident résolu et clôturé",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }, {
    _id: secondStatusId,
    resolve: false,
    description: "Incident en cours",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }, {
    _id: thirdStatusId,
    resolve: false,
    description: "Incident en cours",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }
]);

db.incidents.insertMany([
  {
    placeId: standFB._id,
    conversationId: secondConversationId,
    criticality: 2,
    description: "Enorme feu",
    statusId: firstStatusId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId,
  },
  {
    placeId: VIPentrée._id,
    conversationId: "",
    criticality: 3,
    description: "Plus de place dans les poubelles",
    statusId: secondStatusId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId,
  }, {
    placeId: scenePrincipale._id,
    conversationId: thirdConversationId,
    criticality: 3,
    description: "Artiste principal bloqué, spectacle en danger",
    statusId: thirdStatusId,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId,
  },
]);*/

// Collection: teams
db.teams.insertMany([
  {
    eventId: activeEventId,
    canalId: db.canals.findOne({ number: 1 })._id,
    name: "F&B / Info",
    teamLeaders: [firstUserId],
    description: "Food & Beverage / Info",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    canalId: db.canals.findOne({ number: 2 })._id,
    name: "Artistes",
    teamLeaders: [firstUserId],
    description: "Équipe de coordination des artistes et des performances",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    canalId: db.canals.findOne({ number: 3 })._id,
    name: "Infra",
    teamLeaders: [firstUserId],
    description: "Équipe d'infrastructure et technique",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    canalId: db.canals.findOne({ number: 4 })._id,
    name: "Sécurité",
    teamLeaders: [firstUserId],
    description: "Équipe de sécurité et gestion des foules",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "CECO",
    teamLeaders: [firstUserId],
    description: "Centre de communication",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
]);

// Collection: radios
/*db.radios.insertMany([
  {
    eventId: activeEventId,
    name: "Radio Alpha 1",
    brand: "Motorola",
    model: "DP4400",
    serialNumber: "MT-001",
    status: "available",
    notes: "Radio principale, bon état",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Alpha 2",
    brand: "Motorola",
    model: "DP4400",
    serialNumber: "MT-002",
    status: "checked_out",
    notes: "Assignée à l'équipe sécurité",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Bravo 1",
    brand: "Kenwood",
    model: "TK-3401D",
    serialNumber: "KW-001",
    status: "available",
    notes: "",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Bravo 2",
    brand: "Kenwood",
    model: "TK-3401D",
    serialNumber: "KW-002",
    status: "in_charge",
    notes: "En charge depuis 2h",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Charlie 1",
    brand: "Hytera",
    model: "PD785",
    serialNumber: "HY-001",
    status: "checked_out",
    notes: "Assignée au staff technique",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Charlie 2",
    brand: "Hytera",
    model: "PD785",
    serialNumber: "HY-002",
    status: "maintenance",
    notes: "Bouton PTT défectueux",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Delta 1",
    brand: "Motorola",
    model: "DP4800",
    serialNumber: "MT-010",
    status: "available",
    notes: "Nouveau modèle",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    eventId: activeEventId,
    name: "Radio Delta 2",
    brand: "Motorola",
    model: "DP4800",
    serialNumber: "MT-011",
    status: "lost",
    notes: "Perdue lors du dernier événement",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  }
]);*/

// Collection: members
const members = [
   ["Tim Janin", "", "Infra", "", ""],
   ["Nicolas Clémence", "Grand Nico", "Artistes", "", ""],
   ["Julien Mégevand", "", "F&B / Info", "", ""],
   ["Laetitia Rosset", "Laeti", "Sécurité", "", ""],
   ["Olivier Lorenzi", "", "Sécurité", "", ""],
   ["Pablo Charosky", "Pablito", "F&B / Info", "", ""],
   ["Gabriel Lopes Marques", "", "F&B / Info", "", ""],
   ["Sébastien Ben Chekroun", "Ben", "Artistes", "", ""],
   ["Francine Raccah-kobi", "", "Sécurité", "", ""],
   ["Lucienne Da Silva Mora", "", "F&B / Info", "", ""],
   ["Ania Wisniak", "", "Sécurité", "", ""],
   ["Stéphane Clémence", "", "Sécurité", "", ""],
   ["Célia Boldrini", "", "Sécurité", "", ""],
   ["Fanny Wagner", "", "Sécurité", "", ""],
   ["Christophe Chevallier", "Kryss", "F&B / Info", "", ""],
   ["Nicolas Duboux", "", "Artistes", "", ""],
   ["Ludovic Anderegg", "", "Artistes", "", ""],
   ["Julien Gyr", "", "Artistes", "", ""],
   ["Romain Lauper", "Romix", "Artistes", "", ""],
   ["Cyrille Schweizer", "Lycir", "Artistes", "", ""],
   ["Sébastien Thorimbert", "", "Artistes", "", ""],
   ["Natalia Annaheim", "", "F&B / Info", "", ""],
   ["Marie Durand", "", "F&B / Info", "", ""],
   ["Lisa Landwehr", "", "F&B / Info", "", ""],
   ["Sébastien Baur", "", "F&B / Info", "", ""],
   ["Dora Haldimann", "", "F&B / Info", "", ""],
   ["Bastien Rae", "", "F&B / Info", "", ""],
   ["Diego Do Nascimento", "", "F&B / Info", "", ""],
   ["Léon Panchaud", "", "F&B / Info", "", ""],
   ["Adrien Tambasco", "", "F&B / Info", "", ""],
   ["Julian Infante", "", "Infra", "", ""],
   ["Olivier Ona", "", "Infra", "", ""],
   ["Amandine Greffoz", "", "Infra", "", ""],
   ["Nicolas Ritter", "", "Infra", "", ""],
   ["Davide Ochsenbein", "", "Infra", "", ""],
   ["Alessandro Scaletta", "", "Infra", "", ""],
   ["Nicolas Morisod", "", "Infra", "", ""],
   ["Mishal El-Sanie", "", "CECO", "", ""],
   ["Guy Volluz", "", "CECO", "", ""],
   ["Jonathan Haran", "", "Infra", "", ""],
   ["Simon Maulini (Perm Infra)", "", "Infra", "", ""],
   ["Idanea Maturana", "", "Infra", "", ""],
   ["Emelyne Tzanos", "", "Sécurité", "", ""],
   ["Kady Soumahoro", "", "Infra", "", ""],
   ["Natacha Cattin", "", "Artistes", "", ""],
   ["Eileen Dudley-Martin", "", "Sécurité", "", ""],
   ["Yohan Hubert van Blijenburgh", "", "Sécurité", "", ""],
   ["Valentin Kirchner", "", "Sécurité", "", ""],
   ["Jérôme Mégevand", "", "Sécurité", "", ""],
   ["Benjamin Oz", "Jabi", "Sécurité", "", ""],
   ["Kyo Taha", "", "Sécurité", "", ""],
   ["Bueno Viret", "", "Sécurité", "", ""],
   ["Sylvain Peguet", "", "Sécurité", "", ""],
   ["Senait Rizzo", "", "Sécurité", "", ""],
   ["Michel Ribeiro", "", "Sécurité", "", ""],
   ["Adrien Quinodoz", "Kino", "Sécurité", "", ""],
   ["Ken Christen", "", "Sécurité", "", ""],
   ["Julien Hubert van Blijenburgh", "", "Sécurité", "", ""],
   ["Karin Couchepin", "", "Sécurité", "", ""],
   ["Anne-marie Oberson", "Petit citron", "Sécurité", "", ""],
   ["Kevin Robert", "", "Sécurité", "", ""],
   ["Secu Scène 3 Christophe", "", "Sécurité", "", ""],
   ["Secu Ext 1 Wizard", "", "Sécurité", "", ""],
   ["Secu Ext 2 Wizard", "", "Sécurité", "", ""],
   ["Secu Ext 3 Wizard", "", "Sécurité", "", ""],
   ["SP 1 Prévention", "", "Sécurité", "", ""],
   ["SP 2 Prévention", "", "Sécurité", "", ""],
   ["SP 3 Prévention", "", "Sécurité", "", ""],
   ["CECO Eng 1 Roxane", "", "Sécurité", "", ""],
   ["SI 1 Intervention", "", "Sécurité", "", ""],
   ["SI 2 Intervention", "", "Sécurité", "", ""],
   ["SI 3 Intervention", "", "Sécurité", "", ""],
   ["Cédric Junod (Perm Infra)", "", "Infra", "", ""],
   ["Guanac (Perm Infra)", "", "Infra", "", ""],
   ["Mathilde Delemont (Perm Infra)", "", "Infra", "", ""],
   ["Sums (Perm Infra)", "", "Infra", "", ""],
   ["Will CECO IT", "", "CECO", "", ""],
]
db.members.insertMany([
  {
    eventId: activeEventId,
    teamId: [db.teams.findOne({ name: "CECO" })._id],
    userId: firstUserId,
    name: "Jeremy Gobet",
    surnames: ["Jay"],
    email: ["martin.dubois@radiolog.com"],
    phone: ["+41 78 000 00 00"],
    roleTitles: ["Responsable F&B"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  ...members.map(member => ({
    eventId: activeEventId,
    teamId: [db.teams.findOne({ name: member[2] })._id],
    userId: ObjectId(),
    name: member[0],
    surnames: member[1],
    email: [member[3]],
    phone: [member[4]],
    roleTitles: [],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  })),
]);

// Collection: messages
/*db.messages.insertMany([
  {
    relatedToConversationId: firstConversationId,
    fromMemberId: firstUserId,
    content: [
      { text: "Besoin de 50 bouteilles d'eau supplémentaires au" },
      { text: "stand F&B", placeId: db.places.findOne({ name: "Stand F&B" })._id },
      { text: "assez vite" }
    ],
    createdAt: "2025-06-01T10:05:00Z",
    updatedAt: "2025-06-01T10:05:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    relatedToConversationId: firstConversationId,
    fromMemberId: secondUserId,
    content: [
      { text: "Reçu, je contacte l'équipe" },
      { text: "logistique", teamId: db.teams.findOne({ name: "Logistique" })._id },
      { text: "pour la livraison" }
    ],
    createdAt: "2025-06-01T10:07:00Z",
    updatedAt: "2025-06-01T10:07:00Z",
    createdById: secondUserId,
    updatedById: secondUserId
  },
  {
    relatedToConversationId: firstConversationId,
    fromMemberId: firstUserId,
    content: [
      { text: "Livraison effectuée, merci pour la rapidité" }
    ],
    createdAt: "2025-06-01T10:25:00Z",
    updatedAt: "2025-06-01T10:25:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    relatedToConversationId: secondConversationId,
    fromMemberId: firstUserId,
    content: [
      { text: "Le système de paiement est en panne au" },
      { text: "stand de bouffe", placeId: db.places.findOne({ name: "Stand F&B" })._id },
    ],
    createdAt: "2025-06-01T11:15:00Z",
    updatedAt: "2025-06-01T11:15:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    relatedToConversationId: secondConversationId,
    fromMemberId: thirdUserId,
    content: [
      { text: "J'envoie un" },
      { text: "technicien", teamId: db.teams.findOne({ name: "Techniciens" })._id },
      { text: "immédiatement. Pouvez-vous passer en mode cash en attendant?" }
    ],
    createdAt: "2025-06-01T11:17:00Z",
    updatedAt: "2025-06-01T11:17:00Z",
    createdById: thirdUserId,
    updatedById: thirdUserId
  },
  {
    relatedToConversationId: secondConversationId,
    fromMemberId: firstUserId,
    content: [
      { text: "OK, passage en mode cash. Les clients commencent à s'impatienter" }
    ],
    createdAt: "2025-06-01T11:18:00Z",
    updatedAt: "2025-06-01T11:18:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  },
  {
    relatedToConversationId: secondConversationId,
    fromMemberId: thirdUserId,
    content: [
      { text: "Le" },
      { text: "technicien", teamId: db.teams.findOne({ name: "Techniciens" })._id },
      { text: "est sur place. Problème résolu, le système est de nouveau opérationnel" }
    ],
    createdAt: "2025-06-01T11:35:00Z",
    updatedAt: "2025-06-01T11:35:00Z",
    createdById: thirdUserId,
    updatedById: thirdUserId
  },
  {
    relatedToConversationId: thirdConversationId,
    fromMemberId: secondUserId,
    content: [
      { text: "URGENT: L'artiste principal n'est pas arrivé à la" },
      { text: "scène principale.", placeId: db.places.findOne({ name: "Scène principale" })._id },
      { text: "Le spectacle commence dans 15 minutes!" }
    ],
    createdAt: "2025-06-01T14:45:00Z",
    updatedAt: "2025-06-01T14:45:00Z",
    createdById: secondUserId,
    updatedById: secondUserId
  },
  {
    relatedToConversationId: thirdConversationId,
    fromMemberId: thirdUserId,
    content: [
      { text: "J'ai vérifié le" },
      { text: "backstage", placeId: db.places.findOne({ name: "Backstage" })._id },
      { text: "et le" },
      { text: "parking VIP.", placeId: db.places.findOne({ name: "Parking VIP" })._id },
      { text: "Aucun signe de lui" }
    ],
    createdAt: "2025-06-01T14:48:00Z",
    updatedAt: "2025-06-01T14:48:00Z",
    createdById: thirdUserId,
    updatedById: thirdUserId
  },
  {
    relatedToConversationId: thirdConversationId,
    fromMemberId: secondUserId,
    content: [
      { text: "OK, il était bloqué dans les embouteillages. Il vient d'arriver par l'" },
      { text: "entrée VIP", placeId: db.places.findOne({ name: "Entrée VIP" })._id },
    ],
    createdAt: "2025-06-01T14:52:00Z",
    updatedAt: "2025-06-01T14:52:00Z",
    createdById: secondUserId,
    updatedById: secondUserId
  },
  {
    relatedToConversationId: thirdConversationId,
    fromMemberId: thirdUserId,
    content: [
      { text: "Parfait! Je l'escorte directement au" },
      { text: "backstage", placeId: db.places.findOne({ name: "Backstage" })._id },
    ],
    createdAt: "2025-06-01T14:54:00Z",
    updatedAt: "2025-06-01T14:54:00Z",
    createdById: thirdUserId,
    updatedById: thirdUserId
  },
  {
    relatedToConversationId: thirdConversationId,
    fromMemberId: secondUserId,
    content: [
      { text: "L'artiste est sur" },
      { text: "scène.", placeId: db.places.findOne({ name: "Scène principale" })._id },
      { text: "Situation résolue. Merci à l'" },
      { text: "équipe sécurité", teamId: db.teams.findOne({ name: "Sécurité" })._id },
      { text: "pour la réactivité" }
    ],
    createdAt: "2025-06-01T14:57:00Z",
    updatedAt: "2025-06-01T14:57:00Z",
    createdById: secondUserId,
    updatedById: secondUserId,
  }
]);*/

// Collection: records (vide pour l'instant)
db.createCollection("records");

print("Base de données RadioLog initialisée avec succès!");
