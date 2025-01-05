<template>
  <q-card :class="['dashboard__card--border-radius', 'bg-accent']" @click="navigateToEntry">
    <q-card-section class="row justify-between q-pa-sm">
      <!-- Stage -->
      <StageBadge :stage-id="stageId" size="md" :show-text="true" />

      <!-- Private Entry Notification -->
      <q-badge class="text-weight-thin" rounded v-if="stageId === 'awareness' && observationPrivate" color="primary"
        text-color="accent">
        {{ observationPrivate ? 'Private' : '' }}
      </q-badge>

      <!-- Check In Button for Practcing items -->
      <CheckInButton v-if="stageId === 'practicing'" :entry-id="entryId" :community-id="communityId"
        :community-members-count="communityMembersCount" />
    </q-card-section>

    <!-- Stage-Specific Content -->
    <q-card-section>
      <p class="lora text-primary text-h6 content-text text-weight-bold" v-if="stageId === 'awareness'">
        {{ observation }}
      </p>
      <p class="lora text-primary text-h6 content-text text-weight-bold" v-else-if="stageId === 'implementing'">
        {{ proposal }}
      </p>
      <p class="lora text-primary text-h6 content-text text-weight-bold" v-else-if="stageId === 'practicing'">
        {{ practice }}
      </p>
      <p class="lora text-primary text-h6 content-text text-weight-bold" v-else-if="stageId === 'mastery'">
        {{ mastered }}
      </p>
      <p class="lora text-primary text-h6 content-text text-weight-bold" v-else>
        No content available for this stage.
      </p>
    </q-card-section>

    <!-- Footer with Creation Date -->
    <q-card-section class="row justify-between">
      <q-chip dense class="q-py-xs" size="xs" icon="event" color="accent" text-color="primary"
        :label="formatDate(createdAt)" />
      <VotingButtons :entry-id="entryId" :community-id="communityId" v-if="stageId !== 'mastery'" />
      <GratitudeButton v-if="stageId === 'mastery'" :entry-id="entryId" :community-id="communityId" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import StageBadge from './commons/StageBadge.vue';
import VotingButtons from './commons/VotingButtons.vue';
import GratitudeButton from './commons/GratitudeButton.vue';
import CheckInButton from './commons/CheckInButton.vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  entryId: { type: String, required: true },
  communityId: { type: String, required: true },
  contentType: { type: String, default: 'text' },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, default: null },
  intent: { type: String, default: null },
  mastered: { type: String, default: null },
  needs: { type: Array, default: () => [] },
  observation: { type: String, default: null },
  observationPrivate: { type: Boolean, default: false },
  practice: { type: String, default: null },
  proposal: { type: String, default: null },
  selectedAwarenesses: { type: Array, default: () => [] },
  selectedImplementations: { type: Array, default: () => [] },
  selectedPractice: { type: Array, default: () => [] },
  stageId: { type: String, required: true },
  status: { type: String, default: 'visible' },
  userId: { type: String, required: true },
  communityMembersCount: { type: Number, required: true, default: 0 }
});

// Helper Functions
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

// Navigation handler
const navigateToEntry = (event) => {
  // Prevent navigation if clicking on voting buttons
  if (event.target.closest('.voting-chips')) return;

  // Navigate to entry details
  router.push({ name: 'single-entry', params: { id: props.entryId } });
};
</script>

<style scoped>
.dashboard__card--border-radius {
  border-radius: 10px;
}

.content-text {
  line-height: 1;
}

.date-text {
  line-height: 1;
  font-size: 8px;
}
</style>
