import { defineStore } from "pinia";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../boot/firebase";
import { LocalStorage } from "quasar";

export const useCommunityStore = defineStore("community-store", {
  state: () => ({
    communities: [], // List of communities the user belongs to
    currentCommunity: null, // Active community
  }),
  actions: {
    async fetchCommunities(userId) {
      const profileDoc = await getDoc(doc(db, "profiles", userId));
      if (profileDoc.exists()) {
        this.communities = profileDoc.data().communityIds || [];
      }
    },
    async selectCommunity(communityId) {
      if (!this.communities.includes(communityId)) {
        throw new Error("Invalid community selection.");
      }
      this.currentCommunity = communityId;
    },
    async switchCommunity(communityId) {
      try {
        // Validate the community ID
        if (!this.profile?.communityIds.includes(communityId)) {
          throw new Error("You are not a member of this community.");
        }

        // Update the current community ID in Firestore
        const userDoc = doc(db, "profiles", this.user.uid);
        await updateDoc(userDoc, {
          currentCommunityId: communityId,
        });

        // Update the local state
        this.profile.currentCommunityId = communityId;

        // Persist the updated profile to LocalStorage
        LocalStorage.set("userProfile", JSON.stringify(this.profile));
      } catch (error) {
        console.error("Error switching community:", error.message);
        throw new Error("Unable to switch community. Please try again.");
      }
    },
  },
});
