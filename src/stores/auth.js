import { defineStore } from "pinia";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../boot/firebase";
import { LocalStorage } from "quasar";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    user: null,
    profile: null,
  }),
  actions: {
    async fetchProfile(uid) {
      const profileDoc = await getDoc(doc(db, "profiles", uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();

        // Include currentCommunityId and other fields
        this.profile = {
          userId: profileData.userId,
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          role: profileData.role,
          communityIds: profileData.communityIds || [], // Communities the user belongs to
          currentCommunityId: profileData.currentCommunityId || null, // Current active community
          isVerified: profileData.isVerified,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        };
      } else {
        console.warn("Profile not found for user:", uid);
        this.profile = null;
      }
    },
    async setAuth(user) {
      try {
        if (user) {
          this.user = user;
          await this.trackProfileChanges(user.uid);

          // Fetch the user's profile from Firestore
          const profileDoc = await getDoc(doc(db, "profiles", user.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();

            // Optional: Filter fields if necessary
            this.profile = {
              userId: profileData.userId,
              username: profileData.username,
              fullName: profileData.fullName,
              email: profileData.email,
              role: profileData.role,
              communityIds: profileData.communityIds || [], // array, multiple communities can be joined
            };
          } else {
            console.warn("Profile not found for user:", user.uid);
            this.profile = null;
          }
        } else {
          // Clear user and profile data on logout
          this.user = null;
          this.profile = null;
        }
      } catch (error) {
        console.error("Error setting auth:", error.message);
        this.user = null;
        this.profile = null;
      }
    },
    async getSession() {
      const user = auth.currentUser;
      if (user) {
        await this.setAuth(user);

        // Ensure the active community is set
        if (!this.profile?.currentCommunityId) {
          throw new Error(
            "No active community found. Please select a community."
          );
        }
      } else {
        this.setAuth(null);
      }
    },
    async trackAuthChanges() {
      onAuthStateChanged(auth, async (user) => {
        await this.setAuth(user);
      });
    },
    async trackProfileChanges(uid) {
      const profileRef = doc(db, "profiles", uid);
      onSnapshot(profileRef, (doc) => {
        if (doc.exists()) {
          const profileData = doc.data();
          this.profile = {
            ...profileData,
            communityIds: profileData.communityIds || [],
            currentCommunityId: profileData.currentCommunityId || null,
          };
          LocalStorage.set("userProfile", JSON.stringify(this.profile));
        } else {
          this.profile = null;
          LocalStorage.remove("userProfile");
        }
      });
    },
    async validateCommunitySelection(selectedCommunityId) {
      if (!this.profile?.communityIds.includes(selectedCommunityId)) {
        throw new Error(
          "Selected community is not associated with your account."
        );
      }
    },
    async switchCommunity(communityId) {
      if (!this.profile?.communityIds.includes(communityId)) {
        throw new Error("You are not a member of this community.");
      }

      await updateDoc(doc(db, "profiles", this.user.uid), {
        currentCommunityId: communityId,
      });
      this.profile.currentCommunityId = communityId;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
      this.profile = null;
    },
  },
});
