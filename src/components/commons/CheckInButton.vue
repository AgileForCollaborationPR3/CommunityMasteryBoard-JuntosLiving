<template>
  <q-chip clickable dense class="q-pa-sm" size="sm" :icon="hasCheckedIn ? 'check_circle' : 'radio_button_unchecked'"
    :color="hasCheckedIn ? 'primary' : 'accent'" :text-color="hasCheckedIn ? 'white' : 'primary'"
    :label="`${checkInStats.currentCheckIns} / ${checkInStats.totalMembers}`"
    @click="(event) => toggleCheckIn(event)" />
</template>

<script setup>
import { computed } from "vue";
import { useCheckInsStore } from "../../stores/check-ins-store";
import { useAuthCommunityStore } from "../../stores/auth-community-store";

const props = defineProps({
  entryId: { type: String, required: true },
  communityId: { type: String, required: true },
  communityMembersCount: { type: Number, required: true },
});

const checkInsStore = useCheckInsStore();
const authStore = useAuthCommunityStore();

const hasCheckedIn = computed(() =>
  checkInsStore.checkIns.some(
    (checkIn) =>
      checkIn.entryId === props.entryId &&
      checkIn.userId === authStore.user?.uid &&
      checkIn.checkInDate === new Date().toISOString().split("T")[0]
  )
);

const checkInStats = computed(() =>
  checkInsStore.getCheckInStats(props.entryId, props.communityMembersCount)
);

const toggleCheckIn = async (event) => {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  try {
    if (hasCheckedIn.value) {
      const existingCheckIn = checkInsStore.checkIns.find(
        (checkIn) =>
          checkIn.entryId === props.entryId &&
          checkIn.userId === authStore.user?.uid &&
          checkIn.checkInDate === new Date().toISOString().split("T")[0]
      );
      if (existingCheckIn) {
        await checkInsStore.removeCheckIn(existingCheckIn.checkInId);
      }
    } else {
      await checkInsStore.addCheckIn({
        userId: authStore.user?.uid,
        entryId: props.entryId,
        communityId: props.communityId,
      });
    }
  } catch (error) {
    console.error("Error toggling check-in:", error.message);
  }
};
</script>

<style scoped>
.q-chip {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.q-chip:hover {
  transform: scale(1.05);
}
</style>
