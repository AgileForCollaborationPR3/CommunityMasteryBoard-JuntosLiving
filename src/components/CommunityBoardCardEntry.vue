<template>
  <q-card :class="['dashboard__card--border-radius', contentCategoryClass]">
    <q-card-section class="row justify-between q-pa-sm">
      <UserProfileAvatarMini
        :first-name="firstName"
        :last-name="lastName"
      />
      <StageIconMini
        size="sm"
        :stage-id="stageId"
      />
    </q-card-section>
    <q-card-section v-if="visibility === 'private'" class="bg-warning text-white">
      <strong>Private Entry</strong>
    </q-card-section>
    <q-card-section v-if="contentCategory === 'entry' && stageId === 'awareness'">
      {{ observation }}
    </q-card-section>
    <!-- Add other stage-based sections -->
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  itemId: String,
  firstName: String,
  lastName: String,
  stageId: String,
  contentType: String,
  contentCategory: String,
  observation: String,
  visibility: String, // Add visibility prop
});
</script>

<style scoped>
.dashboard__card--border-radius {
  border-radius: 10px;
}
</style>
