<script setup>
import { useAuthCommunityStore } from '../stores/auth-community-store';

const authCommunityStore = useAuthCommunityStore();
const { profile, communities } = authCommunityStore;

const switchCommunity = async (communityId) => {
  try {
    await authCommunityStore.switchCommunity(communityId);
  } catch (error) {
    console.error(error.message);
  }
};
</script>
<template>
  <div>
    <h3>User Profile</h3>
    <p>Name: {{ profile.fullName }}</p>
    <p>Email: {{ profile.email }}</p>
    <p>Role: {{ profile.role }}</p>
    <h4>Your Communities</h4>
    <ul>
      <li v-for="community in communities" :key="community">
        <span>{{ community }}</span>
        <q-btn label="Switch" @click="switchCommunity(community)" />
      </li>
    </ul>
  </div>
</template>