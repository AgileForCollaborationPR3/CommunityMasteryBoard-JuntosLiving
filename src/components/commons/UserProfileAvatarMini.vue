<script setup>
import { ref } from 'vue'
defineProps({
  firstName: {
    type: String,
    required: true,
    default: 'Maximilianus'
  },
  lastName: {
    type: String,
    required: true,
    default: 'Wanderheijdenburgh'
  }
})

const avatarImageAvailable = ref(false)
</script>

<template>
  <div class="flex items-center">
    <div
      class="q-mr-xs"
      style="width: 20px"
    >
      <div v-if="avatarImageAvailable">
        <q-img
          height="22px"
          width="20px"
          style="border-radius: 5px"
          src="https://cdn.quasar.dev/img/boy-avatar.png"
        />
      </div>

      <div
        v-else
        class="avatar__initials--mini flex flex-center text-white"
      >
        <span>{{ firstName.charAt(0).toUpperCase() }}</span><span>{{ lastName.charAt(0).toUpperCase() }}</span>
      </div>
    </div>

    <div class="chip__username--mini text-caption">
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
