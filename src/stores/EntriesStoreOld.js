import { defineStore } from "pinia";
import { useCommentsStore } from "./CommentsStore";
import dataEntries from "../data/entries.json";

export const useEntriesStoreOld = defineStore("entriesOld", {
  state: () => ({
    entries: dataEntries,
  }),
  getters: {
    // Combine entries and comments, sorted by createdAt
    combinedLatestItems: (state) => {
      const commentsStore = useCommentsStore();

      // Add `contentCategory` to distinguish between entries and comments
      const entriesWithCategory = state.entries.map((entry) => ({
        ...entry,
        contentCategory: "entry",
      }));

      const commentsWithCategory = commentsStore.comments.map((comment) => {
        const associatedEntry = state.entries.find(
          (entry) => entry.entryId === comment.entryId
        );

        return {
          ...comment,
          contentCategory: "comment",
          stageId: associatedEntry ? associatedEntry.stageId : null,
        };
      });

      // Combine entries and comments
      const combinedItems = [...entriesWithCategory, ...commentsWithCategory];

      // Sort combined items by createdAt (descending) and get the last 10
      return combinedItems
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 15);
    },
  },
  actions: {},
});
