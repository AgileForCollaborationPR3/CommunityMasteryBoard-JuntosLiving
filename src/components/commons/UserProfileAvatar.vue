<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  fullName: {
    type: String,
    required: true,
    default: "Unknown User",
  },
  showInitialsOnly: {
    type: Boolean,
    default: false, // Controls whether to show only initials without the name chip
  },
  avatarSize: {
    type: [Number, String],
    default: 44, // Controls the size of the avatar dynamically
  },
  avatarSrc: {
    type: String,
    default: "", // Optional prop for custom avatar image
  },
});

const avatarImageAvailable = ref(!!props.avatarSrc);

// Compute first and last initials
const initials = computed(() => {
  const nameParts = props.fullName.split(" ");
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
  const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
});

const avatarStyle = computed(() => ({
  height: `${props.avatarSize}px`,
  width: `${props.avatarSize}px`,
  fontSize: `${props.avatarSize / 2.5}px`,
  lineHeight: `${props.avatarSize}px`,
  borderRadius: `${props.avatarSize / 8}px`,
}));
</script>

<template>
  <div class="flex items-center">
    <!-- Avatar with initials or image -->
    <div :style="avatarStyle">
      <div v-if="avatarImageAvailable">
        <q-img :height="avatarSize" :width="avatarSize" :src="props.avatarSrc" :style="avatarStyle" />
      </div>
      <div v-else class="avatar__initials flex flex-center text-white" :style="avatarStyle">
        <span>{{ initials }}</span>
      </div>
    </div>

    <!-- Optional username chip -->
    <div v-if="!showInitialsOnly" class="chip__username text-caption text-primary q-ml-xs"
      :style="{ fontSize: `${avatarSize / 3}px` }">
      {{ props.fullName }}
    </div>
  </div>
</template>

<style scoped>
.avatar__initials {
  background-color: #3d140e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.chip__username {
  background-color: #f5eadb;
  border-radius: 5px;
  padding: 4px 8px;
  font-weight: 700;
}
</style>
