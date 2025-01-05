<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  fullName: {
    type: String,
    required: true,
    default: "Unknown User",
  },
});

// Reactive property to indicate if the avatar image is available
const avatarImageAvailable = ref(false);

// Compute first and last names
// Compute first and last names
const firstName = computed(() => {
  const name = props.fullName.split(" ")[0] || "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
});

const lastName = computed(() => props.fullName.split(" ")[1] || "");
</script>

<template>
  <div class="flex items-center">
    <div class="q-mr-xs" style="width: 20px">
      <div v-if="avatarImageAvailable">
        <q-img height="22px" width="20px" style="border-radius: 5px" src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </div>

      <div v-else class="avatar__initials--mini flex flex-center text-white">
        <span>{{ firstName.charAt(0).toUpperCase() }}</span>
        <span>{{ lastName.charAt(0).toUpperCase() }}</span>
      </div>
    </div>

    <div class="chip__username--mini text-caption text-primary">
      {{ firstName }}
    </div>
  </div>
</template>

<style scoped>
.chip__username--mini {
  background-color: #f5eadb;
  border-radius: 5px;
  padding: 0px 4px 0px 4px;
}

.avatar__initials--mini {
  background-color: #3d140e;
  border-radius: 5px;
  height: 20px;
  width: 20px;
  font-size: 8px;
  font-weight: 900;
}
</style>
