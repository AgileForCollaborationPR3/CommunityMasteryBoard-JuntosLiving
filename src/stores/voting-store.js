import { defineStore } from "pinia";
import { db } from "../boot/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export const useVotingStore = defineStore("voting-store", {
  state: () => ({
    votes: {}, // Store votes by entryId
  }),

  getters: {
    // Get all votes for a specific entry
    getVotesForEntry: (state) => (entryId) => {
      return state.votes[entryId] || [];
    },

    // Get vote counts for a specific entry
    getVoteCounts: (state) => (entryId) => {
      const votes = state.votes[entryId] || [];
      return votes.reduce(
        (counts, vote) => {
          counts[vote.voteType] = (counts[vote.voteType] || 0) + 1;
          return counts;
        },
        { "no-objection": 0, concern: 0, objection: 0 }
      );
    },

    // Get the current user's vote for a specific entry
    getUserVoteForEntry: (state) => (entryId, userId) => {
      const votes = state.votes[entryId] || [];
      return votes.find((vote) => vote.userId === userId) || null;
    },
  },

  actions: {
    // Fetch votes for a specific entry
    async fetchVotesForEntry(entryId) {
      try {
        const votesQuery = query(
          collection(db, "votes"),
          where("entryId", "==", entryId)
        );
        const snapshot = await getDocs(votesQuery);

        this.votes[entryId] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          voteId: doc.id,
        }));
      } catch (error) {
        console.error("Error fetching votes:", error.message);
      }
    },

    // Add a new vote
    async addVote(vote) {
      try {
        const voteDoc = await addDoc(collection(db, "votes"), {
          ...vote,
          createdAt: new Date().toISOString(),
        });
        const newVote = { ...vote, voteId: voteDoc.id };

        if (!this.votes[vote.entryId]) {
          this.votes[vote.entryId] = [];
        }
        this.votes[vote.entryId].push(newVote);
      } catch (error) {
        console.error("Error adding vote:", error.message);
      }
    },

    // Remove a vote
    async removeVote(voteId) {
      try {
        await deleteDoc(doc(db, "votes", voteId));

        for (const entryId in this.votes) {
          this.votes[entryId] = this.votes[entryId].filter(
            (vote) => vote.voteId !== voteId
          );
        }
      } catch (error) {
        console.error("Error removing vote:", error.message);
      }
    },

    // Update an existing vote
    async updateVote(voteId, newVoteType) {
      try {
        await updateDoc(doc(db, "votes", voteId), { voteType: newVoteType });

        for (const entryId in this.votes) {
          const vote = this.votes[entryId].find((v) => v.voteId === voteId);
          if (vote) {
            vote.voteType = newVoteType;
          }
        }
      } catch (error) {
        console.error("Error updating vote:", error.message);
      }
    },
  },
});
