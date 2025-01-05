<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEntriesStore } from "../stores/entries-store";
import { useProfileStore } from "../stores/profile-store";
import { useCommentsStore } from "../stores/comments-store";
import UserProfileAvatarMini from "../components/commons/UserProfileAvatarMini.vue";
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
const comments = ref([]);

// Watch route changes to fetch data
watch(
  () => route.params.id,
  () => fetchData(),
  { immediate: true }
);

// Fetch entry data and related comments
async function fetchData() {
  loading.value = true;
  error.value = null;
  entry.value = null;
  comments.value = [];

  try {
    const entryId = route.params.id;
    if (!entryId) throw new Error("Entry ID is missing.");

    // Fetch entry from both member and leader entries
    const allEntries = [
      ...entriesStore.memberEntries,
      ...entriesStore.leaderVisibleEntries,
    ];
    const foundEntry = allEntries.find((e) => e.entryId === entryId);

    if (!foundEntry) throw new Error("Entry not found.");

    // Fetch public profile for the entry's author
    const publicProfile = await profileStore.fetchPublicProfile(foundEntry.userId);

    entry.value = {
      ...foundEntry,
      fullName: publicProfile?.fullName || "Unknown User",
    };

    // Fetch comments for the entry
    comments.value = await Promise.all(
      commentsStore.comments
        .filter((comment) => comment.entryId === entryId)
        .map(async (comment) => {
          const commentUserProfile = await profileStore.fetchPublicProfile(comment.userId);
          return {
            ...comment,
            fullName: commentUserProfile?.fullName || "Unknown User",
          };
        })
    );
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
}

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
      <div v-if="loading">
        <q-card class="bg-accent text-primary q-pa-sm" style="border-radius: 20px">
          <q-skeleton height="200px" square animation="fade" />
        </q-card>
      </div>

      <div v-if="error">
        <q-card class="bg-negative text-white q-pa-sm" style="border-radius: 20px">
          <q-card-section>{{ error }}</q-card-section>
        </q-card>
      </div>

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
            <UserProfileAvatarMini :full-name="entry.fullName" />
            <span class="text-caption text-primary-80">Created on {{ entry.createdAt }}</span>
          </q-card-section>
        </q-card>

        <q-card class="bg-aware q-mt-md" style="border-radius: 20px">
          <q-card-actions class="justify-around q-px-md">
            <q-btn flat round color="red" icon="favorite" />
            <q-btn flat round color="accent" icon="bookmark" />
            <q-btn flat round color="primary" icon="share" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="comments.length">
        <q-card class="bg-secondary text-primary q-pa-sm q-mt-md" style="border-radius: 20px">
          <q-card-section class="text-h6 text-weight-bold">Comments</q-card-section>
          <q-list dense>
            <q-item v-for="comment in comments" :key="comment.commentId" class="q-mt-sm">
              <q-item-section avatar>
                <UserProfileAvatarMini :full-name="comment.fullName" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ comment.comment }}</q-item-label>
                <q-item-label caption class="text-primary-80 text-caption">
                  {{ comment.createdAt }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
