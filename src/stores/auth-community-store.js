import { defineStore } from "pinia";
import { auth, db } from "../boot/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { LocalStorage } from "quasar";

export const useAuthCommunityStore = defineStore("auth-community-store", {
  state: () => ({
    user: null, // Current logged-in user
    profile: null, // User's profile, including communities
    communities: [], // List of communities the user belongs to
    currentCommunity: null, // Currently active community
  }),

  actions: {
    /** Fetch Profile **/
    async fetchProfile(uid) {
      const retryAttempts = 3; // Number of retries
      let profileDoc;

      for (let i = 0; i < retryAttempts; i++) {
        profileDoc = await getDoc(doc(db, "profiles", uid));
        if (profileDoc.exists()) break;
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms before retrying
      }

      if (profileDoc?.exists()) {
        const profileData = profileDoc.data();
        this.profile = {
          userId: profileData.userId,
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          role: profileData.role,
          communityIds: profileData.communityIds || [],
          currentCommunityId: profileData.currentCommunityId || null,
          isVerified: profileData.isVerified,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        };
      } else {
        console.warn("Profile not found for user:", uid);
        this.profile = null;
      }
    },

    /** Set Authentication **/
    async setAuth(user) {
      try {
        if (user) {
          this.user = user;
          await this.trackProfileChanges(user.uid);
          await this.fetchProfile(user.uid);

          // Check if the user has an active community
          if (!this.profile?.currentCommunityId) {
            console.warn(
              "No active community found. Redirecting to community setup."
            );
          }
        } else {
          this.user = null;
          this.profile = null;
        }
      } catch (error) {
        console.error("Error setting auth:", error.message);
        this.user = null;
        this.profile = null;
      }
    },

    /** Get Session **/
    async getSession() {
      const user = auth.currentUser;
      if (user) {
        await this.setAuth(user);

        if (!this.profile?.currentCommunityId) {
          console.warn(
            "No active community found. Redirecting to community setup."
          );
          return; // Added to stop further execution here (took me 2 hours to find this bug)
        }
      } else {
        this.setAuth(null);
      }
    },

    /** Track Authentication Changes **/
    async trackAuthChanges() {
      onAuthStateChanged(auth, async (user) => {
        await this.setAuth(user);
      });
    },

    /** Track Profile Changes **/
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

    /** Fetch Communities **/
    async fetchCommunities() {
      if (this.profile) {
        this.communities = this.profile.communityIds || [];
      }
    },

    /** Validate Community Selection **/
    async validateCommunitySelection(selectedCommunityId) {
      if (!this.profile?.communityIds.includes(selectedCommunityId)) {
        throw new Error(
          "Selected community is not associated with your account."
        );
      }
    },

    /** Switch Community **/
    async switchCommunity(communityId) {
      try {
        if (!this.profile?.communityIds.includes(communityId)) {
          throw new Error("You are not a member of this community.");
        }

        await updateDoc(doc(db, "profiles", this.user.uid), {
          currentCommunityId: communityId,
        });

        this.profile.currentCommunityId = communityId;
        LocalStorage.set("userProfile", JSON.stringify(this.profile));
      } catch (error) {
        console.error("Error switching community:", error.message);
        throw new Error("Unable to switch community. Please try again.");
      }
    },

    /** Create Community **/
    async createCommunity(communityName) {
      try {
        const userId = this.user?.uid;
        if (!userId) throw new Error("User is not logged in.");

        const communityId = `${communityName.toLowerCase()}-${Math.random()
          .toString(36)
          .substr(2, 4)}`;

        // Check for duplicate community names
        const querySnapshot = await getDocs(
          query(
            collection(db, "communities"),
            where("communityName", "==", communityName)
          )
        );
        if (!querySnapshot.empty) {
          throw new Error("Community name already exists. Choose another.");
        }

        await setDoc(doc(db, "communities", communityId), {
          communityId,
          communityName,
          juntosLivingCommunityId: communityId,
          createdBy: userId,
          members: [{ userId, role: "leader" }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Update user profile with the new community
        await updateDoc(doc(db, "profiles", userId), {
          communityIds: arrayUnion(communityId),
          currentCommunityId: communityId,
        });
      } catch (error) {
        console.error("Error creating community:", error.message);
        throw new Error("Unable to create community.");
      }
    },

    /** Join Community **/
    async joinCommunity(juntosLivingCommunityId) {
      try {
        const communityDoc = doc(db, "communities", juntosLivingCommunityId);
        const communitySnap = await getDoc(communityDoc);

        if (!communitySnap.exists()) {
          throw new Error("Community ID not found.");
        }

        await updateDoc(communityDoc, {
          members: arrayUnion({ userId: this.user.uid, role: "member" }),
        });

        await updateDoc(doc(db, "profiles", this.user.uid), {
          communityIds: arrayUnion(juntosLivingCommunityId),
          currentCommunityId: juntosLivingCommunityId,
        });
      } catch (error) {
        console.error("Error joining community:", error.message);
        throw new Error("Unable to join community.");
      }
    },

    /** Logout **/
    async logout() {
      await signOut(auth);
      this.user = null;
      this.profile = null;
      this.communities = [];
      this.currentCommunity = null;
    },
  },
});
