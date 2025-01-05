import { defineStore } from "pinia";
import { db } from "../boot/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

export const useGratitudeStore = defineStore("gratitude-store", {
  state: () => ({
    gratitudeVotes: [], // Gratitude votes fetched from DB
  }),

  actions: {
    /** Fetch gratitude votes for a specific community */
    async fetchGratitudeVotes(communityId) {
      try {
        const q = query(
          collection(db, "gratitudeVotes"),
          where("communityId", "==", communityId)
        );
        const querySnapshot = await getDocs(q);
        this.gratitudeVotes = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          gratitudeId: doc.id,
        }));
      } catch (error) {
        console.error("Error fetching gratitude votes:", error.message);
      }
    },

    /** Add a gratitude vote */
    async addGratitudeVote({ userId, entryId, communityId }) {
      try {
        const intervalStart = this.getIntervalStart();
        const intervalEnd = this.getIntervalEnd();

        const newVote = {
          userId,
          entryId,
          communityId,
          intervalStart,
          intervalEnd,
          createdAt: serverTimestamp(),
        };

        const gratitudeDocRef = doc(
          collection(db, "gratitudeVotes"),
          `${entryId}_${userId}_${intervalStart}`
        );

        await setDoc(gratitudeDocRef, newVote);
        this.gratitudeVotes.push({
          ...newVote,
          gratitudeId: gratitudeDocRef.id,
        });
      } catch (error) {
        console.error("Error adding gratitude vote:", error.message);
      }
    },

    /** Remove a gratitude vote */
    async removeGratitudeVote(gratitudeId) {
      try {
        await deleteDoc(doc(db, "gratitudeVotes", gratitudeId));
        this.gratitudeVotes = this.gratitudeVotes.filter(
          (vote) => vote.gratitudeId !== gratitudeId
        );
      } catch (error) {
        console.error("Error removing gratitude vote:", error.message);
      }
    },

    /** Get current interval start (default to today) */
    getIntervalStart() {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Midnight
      return Timestamp.fromDate(now);
    },

    /** Get current interval end (default to today) */
    getIntervalEnd() {
      const now = new Date();
      now.setHours(23, 59, 59, 999); // End of day
      return Timestamp.fromDate(now);
    },

    /** Check if user has already voted for an entry in the interval */
    hasVoted(entryId, userId) {
      const intervalStart = this.getIntervalStart();
      return this.gratitudeVotes.some(
        (vote) =>
          vote.entryId === entryId &&
          vote.userId === userId &&
          vote.intervalStart.seconds === intervalStart.seconds
      );
    },

    /** Get gratitude stats for an entry */
    getGratitudeStats(entryId) {
      const totalVotes = this.gratitudeVotes.filter(
        (vote) => vote.entryId === entryId
      ).length;

      const intervalVotes = this.gratitudeVotes.filter(
        (vote) =>
          vote.entryId === entryId &&
          vote.intervalStart.seconds === this.getIntervalStart().seconds
      ).length;

      return { totalVotes, intervalVotes };
    },
  },
});
