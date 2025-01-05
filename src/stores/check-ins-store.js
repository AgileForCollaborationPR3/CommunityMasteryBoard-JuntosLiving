import { defineStore } from "pinia";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../boot/firebase";

export const useCheckInsStore = defineStore("check-ins", {
  state: () => ({
    checkIns: [], // Holds check-in records for the current session
  }),
  actions: {
    async fetchCheckIns(entryId, communityId) {
      try {
        const q = query(
          collection(db, "checkIns"),
          where("entryId", "==", entryId),
          where("communityId", "==", communityId)
        );
        const querySnapshot = await getDocs(q);
        this.checkIns = querySnapshot.docs.map((doc) => ({
          checkInId: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching check-ins:", error.message);
        throw new Error("Failed to fetch check-ins.");
      }
    },
    async addCheckIn({ userId, entryId, communityId }) {
      try {
        const checkInData = {
          userId,
          entryId,
          communityId,
          checkInDate: new Date().toISOString().split("T")[0],
          status: "confirmed",
          score: 1,
        };
        const docRef = await addDoc(collection(db, "checkIns"), checkInData);
        this.checkIns.push({ checkInId: docRef.id, ...checkInData });
      } catch (error) {
        console.error("Error adding check-in:", error.message);
        throw new Error("Failed to add check-in.");
      }
    },
    async removeCheckIn(checkInId) {
      try {
        // Remove check-in locally
        this.checkIns = this.checkIns.filter(
          (checkIn) => checkIn.checkInId !== checkInId
        );

        // You can also delete from Firestore using deleteDoc if required
      } catch (error) {
        console.error("Error removing check-in:", error.message);
        throw new Error("Failed to remove check-in.");
      }
    },
    getCheckInStats(entryId, communityMembersCount) {
      const checkInsForEntry = this.checkIns.filter(
        (checkIn) => checkIn.entryId === entryId
      );
      return {
        currentCheckIns: checkInsForEntry.length,
        totalMembers: communityMembersCount,
      };
    },
  },
});
