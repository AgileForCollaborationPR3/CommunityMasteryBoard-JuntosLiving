<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEntriesStore } from '../stores/entries-store'
import { useUsersStore } from '../stores/users-store'
import { useCommentsStore } from '../stores/comments-store'
import UserProfileAvatarMini from '../components/commons/UserProfileAvatarMini.vue'

const route = useRoute()
const entriesStore = useEntriesStore()
const usersStore = useUsersStore()
const commentsStore = useCommentsStore()

defineOptions({
  name: 'SingleEntryOld'
})

// Reactive refs for entry data

const loading = ref(false)
const error = ref(null)
const entry = ref(null)
const comments = ref(null)
const entryId = ref(null)

// watch the params of the route to fetch the data again
watch(() => route.params.id, fetchData, { immediate: true })

// Fetch the entry and its associated comments
async function fetchData() {
  entryId.value = route.params.id
  error.value = entry.value = null
  comments.value = []
  loading.value = true

  try {
    // find entry by ID
    const foundEntry = await entriesStore.entries.find(
      (e) => e.entryId === entryId.value
    )
    if (foundEntry) {
      const user = await usersStore.users.find(
        (u) => u.userId === foundEntry.userId
      )
      entry.value = {
        ...foundEntry,
        firstName: user?.firstName || 'Unknown',
        lastName: user?.lastName || 'User'
      }

      // Fetch comments related to this entry from CommentsStore
      comments.value = commentsStore.comments
        .filter((comment) => comment.entryId === entryId.value)
        .map((comment) => {
          const commentUser = usersStore.users.find(
            (u) => u.userId === comment.userId
          )
          return {
            ...comment,
            firstName: commentUser?.firstName || 'Unknown',
            lastName: commentUser?.lastName || 'User'
          }
        })
    }
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-page class="bg-lpage q-px-sm">
    <q-page-sticky position="top-left" :offset="[0, 0]" style="z-index: 3" class="bg-lpage">
      <q-toolbar class="text-primary">
        <q-btn filled round color="primary" text-color="accent" dense icon="o_arrow_back" />
        <q-toolbar-title class="lora text-h6 text-weight-bold">
          Awareness
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>

    <div class="q-mt-xs" :style="{ paddingTop: '52px' }">
      <div v-if="loading">
        <q-card class="bg-accent text-primary q-pa-sm" style="border-radius: 20px">
          <q-item>
            <q-item-section avatar>
              <q-skeleton type="QAvatar" animation="fade" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="QChip" animation="fade" />
              </q-item-label>
            </q-item-section>
            <q-item-section align="right">
              <q-item-label>
                <q-skeleton type="QCheckbox" animation="fade" />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-skeleton height="200px" square animation="fade" />

          <q-card-actions align="left" class="q-gutter-md">
            <q-skeleton type="QBtn" animation="fade" />
            <q-skeleton type="QBtn" animation="fade" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="error">
        {{ error }}
      </div>

      <div v-if="entry">
        <q-card class="bg-accent text-primary q-pa-sm" style="border-radius: 20px">
          <q-card-section v-if="entry.stageId === 'awareness'" class="q-pa-sm">
            <span class="">{{ entry.observation }}</span>
          </q-card-section>
          <!--
          <q-card-section class="nunito text-h6 text-weight-regular q-pa-sm">
            <p class="q-pb-none q-mb-none nunito text-caption text-primary-80">
              Desires, Needs and Values at Play
            </p>
            <q-list dense class="rounded-borders q-ml-none q-pl-none">
              <q-item>
                <q-item-section
                  class="nunito text-primary text-body2 q-ml-none"
                >
                  &#x2022; Reason dfsdjkldsf dkfjslmk skdjfm .
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>-->
          <q-card-section class="row justify-between">
            <UserProfileAvatarMini :first-name="entry.firstName" :last-name="entry.lastName" />
            <!--<span class="text-caption text-primary-80"
              >Posted On 21-11-2024</span> -->
          </q-card-section>
        </q-card>

        <q-card class="bg-aware q-mt-md" style="border-radius: 20px">
          <q-card-actions class="justify-around q-px-md">
            <q-btn flat round color="red" icon="favorite" />
            <q-btn flat round color="accent" icon="bookmark" />
            <q-btn flat round color="primary" icon="share" />
          </q-card-actions>
        </q-card>
        <div>
          <h6 class="lora text-h6 text-primary text-weight-bold q-mb-none q-mt-md">
            Comments
          </h6>
          <div v-if="comments.length === 0" class="text-caption text-grey">
            No comments yet.
          </div>
          <div v-else>
            <q-card v-for="comment in comments" :key="comment.commentId" class="bg-white text-primary q-pa-sm q-mb-sm"
              style="border-radius: 10px">
              <q-card-section class="q-pt-sm q-pb-none row justify-between">
                <UserProfileAvatarMini :first-name="comment.firstName" :last-name="comment.lastName" />
                <span class="text-caption text-primary-80">{{
                  comment.createdAt
                  }}</span>
              </q-card-section>
              <q-card-section class="text-primary nunito">
                {{ comment.comment }}
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style></style>
