<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEntriesStore } from "../stores/entries-store";
import { useProfileStore } from "../stores/profile-store";
import { useCommentsStore } from "../stores/comments-store";
import CommentsSection from "../components/CommentsSection.vue";
import UserProfileAvatar from "../components/commons/UserProfileAvatar.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const entriesStore = useEntriesStore();
const profileStore = useProfileStore();
const commentsStore = useCommentsStore();

const loading = ref(false);
const error = ref(null);
const entry = ref(null);

// Fetch entry and comments
const fetchEntry = async () => {
  loading.value = true;
  error.value = null;

  try {
    const entryId = route.params.id;
    if (!entryId) throw new Error("Entry ID is missing.");

    // Fetch entry
    const foundEntry = await entriesStore.fetchEntryById(entryId);
    if (!foundEntry) throw new Error("Entry not found.");

    // Fetch public profile for the entry's author
    const publicProfile = await profileStore.fetchPublicProfile(foundEntry.userId);
    entry.value = {
      ...foundEntry,
      fullName: publicProfile?.fullName || "Unknown User",
    };

    // Fetch comments for the entry
    await commentsStore.fetchCommentsByEntryId(entryId);
  } catch (err) {
    error.value = err.message || "Failed to load entry.";
    console.error("Error fetching entry data:", err);
    $q.notify({
      type: "negative",
      message: error.value,
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEntry);
</script>

<template>
  <q-page class="bg-lpage q-px-sm">
    <q-page-sticky position="top-left" :offset="[0, 0]" class="bg-lpage">
      <q-toolbar class="text-primary">
        <q-btn filled round color="primary" text-color="accent" dense icon="o_arrow_back"
          @click="router.push('/board')" />
        <q-toolbar-title class="lora text-h6 text-weight-bold">
          Entry Details
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>

    <div class="q-mt-xs" :style="{ paddingTop: '52px' }">
      <q-card v-if="loading" class="bg-accent text-primary q-pa-sm" style="border-radius: 20px">
        <q-skeleton height="200px" square animation="fade" />
      </q-card>

      <q-card v-if="error" class="bg-negative text-white q-pa-sm" style="border-radius: 20px">
        <q-card-section>{{ error }}</q-card-section>
      </q-card>

      <div v-if="entry">
        <q-card class="bg-accent text-primary q-pa-sm" style="border-radius: 20px">
          <q-card-section>
            <div v-if="entry.stageId === 'awareness'" class="q-pa-sm">
              <span class="text-h5 text-primary lora text-weight-bold">{{ entry.observation }}</span>
            </div>
            <div v-else-if="entry.stageId === 'practicing'" class="q-pa-sm">
              <span class="text-h5 text-primary lora text-weight-bold">{{ entry.practice }}</span>
            </div>
            <div v-else-if="entry.stageId === 'implementing'" class="q-pa-sm">
              <span class="text-h5 text-primary lora text-weight-bold">{{ entry.proposal }}</span>
            </div>
            <div v-else-if="entry.stageId === 'mastery'" class="q-pa-sm">
              <span class="text-h5 text-primary lora text-weight-bold">{{ entry.mastered }}</span>
            </div>
          </q-card-section>
          <q-card-section class="row justify-between q-pa-sm">
            <UserProfileAvatar :full-name="entry.fullName" />
            <span class="text-caption text-primary-80">Created on {{ entry.createdAt }}</span>
          </q-card-section>
        </q-card>
        <div class="text-h6 lora text-weight-bold text-primary q-pt-md q-pb-none">Comments</div>
        <CommentsSection :entry-id="entry.entryId" />
      </div>
    </div>
  </q-page>
</template>
