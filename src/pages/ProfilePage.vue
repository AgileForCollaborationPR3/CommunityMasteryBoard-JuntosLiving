<script setup>
import { ref } from "vue";
import { useAuthCommunityStore } from "../stores/auth-community-store";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();
const $q = useQuasar();
const authCommunityStore = useAuthCommunityStore();

const { profile, communities } = authCommunityStore;

// State for editing profile
const editing = ref(false);
const firstName = ref(profile?.fullName?.split(" ")[0] || "First");
const lastName = ref(profile?.fullName?.split(" ")[1] || "Last");

// Logout function
const logout = async () => {
  try {
    await authCommunityStore.logout();
    router.push("/login");
    $q.notify({ type: "positive", message: "Logged out successfully!" });
  } catch (error) {
    console.error("Logout error:", error.message);
    $q.notify({ type: "negative", message: "Failed to log out." });
  }
};

// Save profile changes
const saveProfile = async () => {
  try {
    const updatedFullName = `${firstName.value} ${lastName.value}`;
    await authCommunityStore.updateProfile({ fullName: updatedFullName });
    $q.notify({ type: "positive", message: "Profile updated successfully!" });
    editing.value = false;
  } catch (error) {
    console.error("Profile update error:", error.message);
    $q.notify({ type: "negative", message: "Failed to update profile." });
  }
};

// Switch community
const switchCommunity = async (communityId) => {
  try {
    await authCommunityStore.switchCommunity(communityId);
    $q.notify({
      type: "positive",
      message: `Switched to community: ${communityId}`,
    });
  } catch (error) {
    console.error(error.message);
    $q.notify({ type: "negative", message: "Failed to switch community." });
  }
};
</script>

<template>
  <div class="q-pa-lg">
    <h3>User Profile</h3>

    <!-- Profile Information -->
    <div>
      <p>
        <strong>Name:</strong>
        <span v-if="!editing">{{ profile?.fullName }}</span>
        <span v-else>
          <q-input v-model="firstName" placeholder="First Name" dense outlined class="q-mb-sm" />
          <q-input v-model="lastName" placeholder="Last Name" dense outlined class="q-mb-sm" />
        </span>
      </p>
      <p><strong>Email:</strong> {{ profile?.email }}</p>
      <p><strong>Role:</strong> {{ profile?.role }}</p>

      <!-- Edit and Save Buttons -->
      <q-btn v-if="!editing" label="Edit Profile" @click="editing = true" color="primary" />
      <q-btn v-else label="Save Changes" @click="saveProfile" color="positive" />
    </div>

    <!-- Logout Button -->
    <div class="q-mt-md">
      <q-btn label="Logout" color="negative" flat @click="logout" />
      <q-btn label="Community" color="negative" flat @click="router.push('/community')" />
    </div>

    <!-- Community List -->
    <h4 class="q-mt-lg">Your Communities</h4>
    <ul>
      <li v-for="community in communities" :key="community" class="q-mb-sm">
        <span>{{ community }}</span>
        <q-btn label="Switch" color="primary" @click="switchCommunity(community)" />
      </li>
    </ul>
  </div>
</template>
