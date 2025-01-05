import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../boot/firebase";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null, // Current user's full profile
    publicProfiles: {}, // Cached public profiles for other users
  }),

  actions: {
    // Fetch the logged-in user's full profile
    async fetchProfile(userId) {
      try {
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.profile = docSnap.data();
        } else {
          throw new Error("Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        throw new Error("Failed to fetch profile.");
      }
    },

    // Fetch public profile for other users
    async fetchPublicProfile(userId) {
      // Return cached data if available
      if (this.publicProfiles[userId]) {
        return this.publicProfiles[userId];
      }

      try {
        const docRef = doc(db, "publicProfiles", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const publicProfile = docSnap.data();
          this.publicProfiles[userId] = publicProfile; // Cache the result
          return publicProfile;
        } else {
          throw new Error("Public profile not found.");
        }
      } catch (error) {
        console.error("Error fetching public profile:", error.message);
        throw new Error("Failed to fetch public profile.");
      }
    },
  },
});
