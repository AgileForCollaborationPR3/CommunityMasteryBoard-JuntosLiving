<template>
  <div class="voting-chips">
    <!-- Thumbs Up -->
    <q-chip clickable dense class="q-pa-xs" size="xs" icon="thumb_up"
      :color="currentVoteType === 'no-objection' ? 'primary' : 'accent'"
      :text-color="currentVoteType === 'no-objection' ? 'white' : 'primary'" :label="`${votes['no-objection'] || 0}`"
      @click="(event) => castVote('no-objection', event)" />

    <!-- Concern -->
    <q-chip clickable dense class="q-pa-xs" size="xs" icon="volunteer_activism"
      :color="currentVoteType === 'concern' ? 'primary' : 'accent'"
      :text-color="currentVoteType === 'concern' ? 'white' : 'primary'" :label="`${votes['concern'] || 0}`"
      @click="(event) => castVote('concern', event)" />

    <!-- Objection -->
    <q-chip clickable dense class="q-pa-xs" size="xs" icon="thumb_down"
      :color="currentVoteType === 'objection' ? 'primary' : 'accent'"
      :text-color="currentVoteType === 'objection' ? 'white' : 'primary'" :label="`${votes['objection'] || 0}`"
      @click="(event) => castVote('objection', event)" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useVotingStore } from "../../stores/voting-store";
import { useAuthCommunityStore } from "../../stores/auth-community-store";

const props = defineProps({
  entryId: { type: String, required: true },
  communityId: { type: String, required: true },
});

const votingStore = useVotingStore();
const authStore = useAuthCommunityStore();

const currentVote = computed(() => {
  return votingStore.getUserVoteForEntry(props.entryId, authStore.user.uid);
});

const currentVoteType = computed(() => currentVote.value?.voteType || null);

const votes = computed(() => {
  return votingStore.getVoteCounts(props.entryId);
});

const castVote = async (voteType, event) => {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  try {
    if (currentVote.value) {
      if (currentVote.value.voteType === voteType) {
        await votingStore.removeVote(currentVote.value.voteId);
      } else {
        await votingStore.updateVote(currentVote.value.voteId, voteType);
      }
    } else {
      await votingStore.addVote({
        userId: authStore.user.uid,
        entryId: props.entryId,
        communityId: props.communityId,
        voteType,
      });
    }
  } catch (error) {
    console.error("Error casting vote:", error.message);
  }
};
</script>

<style scoped>
.voting-chips {
  display: flex;
  gap: 0px;
}
</style>
