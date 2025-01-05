import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../boot/firebase";

async function fetchEntriesByCriteria(communityId, criteria = {}) {
  const constraints = [where("communityId", "==", communityId)];
  for (const [key, value] of Object.entries(criteria)) {
    constraints.push(where(key, "==", value));
  }
  const q = query(collection(db, "entries"), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ entryId: doc.id, ...doc.data() }));
}

export const useEntriesStore = defineStore("entries", {
  state: () => ({
    memberEntries: [],
    leaderVisibleEntries: [],
    leaderArchivedEntries: [],
  }),
  getters: {
    combinedLatestItems: (state) => {
      // Combine entries for "New" filter
      return [...state.memberEntries]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 15);
    },
  },
  actions: {
    async fetchMemberEntries(communityId) {
      try {
        if (!communityId) throw new Error("Invalid community ID.");
        const entries = await fetchEntriesByCriteria(communityId, {
          status: "visible",
        });
        this.memberEntries = entries.filter(
          (entry) => entry.stageId !== "awareness" || !entry.observationPrivate
        );
      } catch (error) {
        console.error("Error fetching member entries:", error.message);
        throw new Error(error.message || "Failed to fetch member entries.");
      }
    },
    async fetchLeaderVisibleEntries(communityId) {
      try {
        if (!communityId) throw new Error("Invalid community ID.");
        this.leaderVisibleEntries = await fetchEntriesByCriteria(communityId, {
          status: "visible",
        });
      } catch (error) {
        console.error("Error fetching leader visible entries:", error.message);
        throw new Error(
          error.message || "Failed to fetch leader visible entries."
        );
      }
    },
    async fetchLeaderArchivedEntries(communityId) {
      try {
        if (!communityId) throw new Error("Invalid community ID.");
        this.leaderArchivedEntries = await fetchEntriesByCriteria(communityId, {
          status: "archived",
        });
      } catch (error) {
        console.error("Error fetching leader archived entries:", error.message);
        throw new Error(
          error.message || "Failed to fetch leader archived entries."
        );
      }
    },
    async fetchEntryById(entryId) {
      try {
        if (!entryId) throw new Error("Invalid entry ID.");
        const docRef = doc(db, "entries", entryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { entryId: docSnap.id, ...docSnap.data() };
        } else {
          throw new Error("Entry not found.");
        }
      } catch (error) {
        console.error("Error fetching entry by ID:", error.message);
        throw new Error(error.message || "Failed to fetch entry by ID.");
      }
    },
    async addNewEntry(entryData) {
      try {
        // Generate a unique entryId
        const entryRef = doc(collection(db, "entries")); // Generates a unique ID
        const entryId = entryRef.id;
        console.log("entryId Generated: " + entryId);

        // Include the entryId in the data
        const completeEntryData = {
          ...entryData,
          entryId: entryId,
        };

        console.log("complete Entry Data");
        console.log(completeEntryData);
        console.log(completeEntryData.createdAt);

        // Save the entry to Firestore
        await setDoc(entryRef, completeEntryData);

        console.log("Entry added with ID:", entryId);
        return entryId;
      } catch (error) {
        console.error("Error adding entry:", error.message);
        throw new Error(error.message || "Failed to add new entry.");
      }
    },
  },
});
