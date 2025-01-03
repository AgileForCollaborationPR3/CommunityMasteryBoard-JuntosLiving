<script setup>
import { ref } from "vue";
import { useAuthCommunityStore } from "../stores/auth-community-store";
import { useQuasar } from "quasar";

const authCommunityStore = useAuthCommunityStore();
const $q = useQuasar();

const formData = ref({
  communityName: "",
  juntosLivingCommunityId: "",
});
const isCreatingCommunity = ref(true);

const toggleCommunityAction = () => {
  isCreatingCommunity.value = !isCreatingCommunity.value;
};

const handleSubmit = async () => {
  try {
    if (isCreatingCommunity.value) {
      await authCommunityStore.createCommunity(formData.value.communityName);
      $q.notify({ type: "positive", message: "Community created successfully!" });
    } else {
      await authCommunityStore.joinCommunity(formData.value.juntosLivingCommunityId);
      $q.notify({ type: "positive", message: "Joined community successfully!" });
    }
  } catch (error) {
    $q.notify({ type: "negative", message: error.message || "Operation failed." });
  }
};
</script>
<template>
  <div>
    <q-form @submit.prevent="handleSubmit">
      <q-input
        v-if="isCreatingCommunity"
        v-model="formData.communityName"
        label="Community Name"
        rules="[val => !!val || 'Community name is required.']"
      />
      <q-input
        v-else
        v-model="formData.juntosLivingCommunityId"
        label="Community ID"
        rules="[val => !!val || 'Community ID is required.']"
      />
      <q-btn type="submit" label="Submit" />
      <q-btn flat label="Switch to {{ isCreatingCommunity ? 'Join' : 'Create' }}" @click="toggleCommunityAction" />
    </q-form>
  </div>
</template>
