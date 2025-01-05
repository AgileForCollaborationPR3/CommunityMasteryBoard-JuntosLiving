<template>
  <div class="gratitude-button">
    <q-chip clickable dense class="q-pa-xs" size="xs" icon="favorite" :color="hasVoted ? 'primary' : 'accent'"
      :text-color="hasVoted ? 'white' : 'primary'"
      :label="`${gratitudeStats.intervalVotes} / ${gratitudeStats.totalVotes}`"
      @click="(event) => toggleGratitude(event)" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGratitudeStore } from "../../stores/gratitude-store";
import { useAuthCommunityStore } from "../../stores/auth-community-store";

const props = defineProps({
  entryId: { type: String, required: true },
  communityId: { type: String, required: true },
});

const gratitudeStore = useGratitudeStore();
const authStore = useAuthCommunityStore();

// Check if the user has already voted
const hasVoted = computed(() =>
  gratitudeStore.hasVoted(props.entryId, authStore.user.uid)
);

// Get gratitude stats for this entry
const gratitudeStats = computed(() =>
  gratitudeStore.getGratitudeStats(props.entryId)
);

// Toggle gratitude vote

const toggleGratitude = async (event) => {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  try {
    if (hasVoted.value) {
      // Remove vote
      const vote = gratitudeStore.gratitudeVotes.find(
        (v) =>
          v.entryId === props.entryId &&
          v.userId === authStore.user.uid &&
          v.intervalStart.seconds ===
          gratitudeStore.getIntervalStart().seconds
      );
      if (vote) {
        await gratitudeStore.removeGratitudeVote(vote.gratitudeId);
      }
    } else {
      // Add vote
      await gratitudeStore.addGratitudeVote({
        userId: authStore.user.uid,
        entryId: props.entryId,
        communityId: props.communityId,
      });
    }
  } catch (error) {
    console.error("Error toggling gratitude vote:", error.message);
  }
};
</script>

<style scoped>
.gratitude-button {
  display: flex;
}

.gratitude-stats {
  font-size: 8px;
  color: var(--q-primary);
}
</style>
