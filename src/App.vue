<script setup>
import { onMounted } from "vue";
import { useAuthCommunityStore } from "src/stores/auth-community-store";

const authCommunityStore = useAuthCommunityStore();

onMounted(async () => {
  try {
    // Initialize session and track authentication state
    await authCommunityStore.getSession();
    authCommunityStore.trackAuthChanges();
  } catch (error) {
    console.error("Error during app initialization:", error.message);
  }
});
</script>

<template>
  <router-view />
</template>
