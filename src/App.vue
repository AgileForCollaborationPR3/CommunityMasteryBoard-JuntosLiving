<script setup>
import { onMounted } from 'vue';
import { useAuthCommunityStore } from './stores/auth-community-store';

onMounted(async () => {
  const authCommunityStore = useAuthCommunityStore();
  await authCommunityStore.getSession(); // Check for an existing session
  authCommunityStore.trackAuthChanges(); // Track Firebase authentication state
});
</script>
<template>
  <router-view />
</template>
