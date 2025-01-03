import { defineStore } from "pinia";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../boot/firebase";
import { useAuthCommunityStore } from "./auth-community-store";

export const useEntriesStore = defineStore("entries", {
  state: () => ({
    entries: [], // All entries for the current community
  }),
  getters: {
    combinedLatestItems: (state) => {
      // Combine entries for display in "New" filter
      return [...state.entries]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 15);
    },
  },
  actions: {
    async fetchEntries(communityId) {
      try {
        const authCommunityStore = useAuthCommunityStore();
        const role = authCommunityStore.profile.role;

        // Query for entries belonging to the current community
        const q = query(
          collection(db, "entries"),
          where("communityId", "==", communityId)
        );
        const querySnapshot = await getDocs(q);

        this.entries = querySnapshot.docs
          .map((doc) => ({
            entryId: doc.id,
            ...doc.data(),
          }))
          .filter((entry) => {
            // Show all public entries and private entries if the user is the leader
            return (
              entry.visibility === "public" ||
              (entry.visibility === "private" && role === "leader")
            );
          });
      } catch (error) {
        console.error("Error fetching entries:", error.message);
        throw new Error("Failed to load community entries.");
      }
    },
  },
});
