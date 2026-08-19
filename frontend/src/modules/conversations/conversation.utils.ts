import { ConversationSummary } from "./conversation.model";

export type SortOption = "date_desc" | "date_asc" | "criticality_desc" | "criticality_asc";

export function sortConversations(conversations: ConversationSummary[], sortOption: SortOption): ConversationSummary[] {
  const sorted = [...conversations];

  sorted.sort((a, b) => {
    if (sortOption === "date_desc") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortOption === "date_asc") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }

    const weights: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const weightA = weights[(a.criticality || "low").toLowerCase()] || 0;
    const weightB = weights[(b.criticality || "low").toLowerCase()] || 0;

    if (sortOption === "criticality_desc") {
      if (weightA !== weightB) return weightB - weightA;
      // Secondary sort by date
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }

    if (sortOption === "criticality_asc") {
      if (weightA !== weightB) return weightA - weightB;
      // Secondary sort by date
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }

    return 0;
  });

  return sorted;
}
