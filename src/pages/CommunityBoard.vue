<script setup>
import { ref, computed, onMounted } from "vue";
import CommunityBoardCardEntry from "src/components/CommunityBoardCardEntry.vue";
import { useEntriesStore } from "../stores/entries-store";
import { useAuthCommunityStore } from "../stores/auth-community-store";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import StageBadge from "src/components/commons/StageBadge.vue";

const $q = useQuasar();
const entriesStore = useEntriesStore();
const authCommunityStore = useAuthCommunityStore();
const router = useRouter();

const filters = ["new", "awareness", "practicing", "implementing", "mastery"];
const activeFilter = ref("new");

// Horizontal scroll area style for filter
const thumbStyle = ref({
  width: "0px",
  opacity: 0,
});

const barStyle = ref({
  width: "0px",
  opacity: 0,
});

// Community Members Count
const communityMembersCount = computed(() => authCommunityStore.communityMembersCount);



const filteredItems = computed(() => {
  const allEntries =
    authCommunityStore.profile.role === "leader"
      ? entriesStore.leaderVisibleEntries
      : entriesStore.memberEntries;

  if (activeFilter.value === "new") {
    return allEntries;
  }

  return allEntries.filter((entry) => entry.stageId === activeFilter.value.toLowerCase());
});

const splitCards = computed(() => {
  const columns = [[], []];
  filteredItems.value.forEach((card, index) => {
    columns[index % 2].push(card);
  });
  return columns;
});

onMounted(async () => {
  try {
    // Ensure user and community are loaded
    const currentCommunityId = authCommunityStore.profile?.currentCommunityId;
    const userRole = authCommunityStore.profile?.role;

    if (!currentCommunityId) {
      router.push("/community"); // Redirect if no community is selected
      return;
    }

    // Fetch data based on role
    if (userRole === "leader") {
      await entriesStore.fetchLeaderVisibleEntries(currentCommunityId);
      await entriesStore.fetchLeaderArchivedEntries(currentCommunityId);
    } else {
      await entriesStore.fetchMemberEntries(currentCommunityId);
    }
  } catch (error) {
    console.error("Error loading community board:", error.message);
    $q.notify({
      type: "negative",
      message: error.message || "Failed to load community board.",
    });
  }
});
</script>


<template>
  <q-page class="bg-lpage q-px-sm">
    <q-page-sticky position="top-left" :offset="[0, 0]" style="z-index: 3" class="bg-lpage">
      <q-toolbar class="text-primary" style="border-radius: 20px">
        <q-toolbar-title class="lora text-h6 text-weight-bold">
          Community Board
        </q-toolbar-title>
        <q-btn filled round color="primary" text-color="accent" dense icon="o_list" />
      </q-toolbar>

      <div class="q-px-lg" :style="{ width: $q.screen.width, height: '35px' }">
        <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"
          :style="{ width: $q.screen.width - 48 + 'px', height: '35px' }">
          <div class="row no-wrap q-pt-xs">
            <StageBadge class="q-mx-xs" v-for="filter in filters" :key="filter" :stage-id="filter" size="md"
              :show-text="true" :active="activeFilter === filter" :opacity="activeFilter !== filter"
              @click="activeFilter = filter" />
          </div>
        </q-scroll-area>
      </div>
    </q-page-sticky>
    <div class="bg-lpage masonry-grid q-mt-md q-pb-md" :style="{ paddingTop: '85px' }">
      <div v-for="(columnItems, columnIndex) in splitCards" :key="columnIndex" class="column">
        <div v-for="item in columnItems" :key="`${activeFilter}-${item.entryId}`" class="masonry-item">
          <CommunityBoardCardEntry :entry-id="item.entryId" :community-id="item.communityId"
            :content-type="item.contentType || 'text'" :created-at="item.createdAt" :updated-at="item.updatedAt"
            :intent="item.intent || null" :mastered="item.mastered || null" :needs="item.needs || []"
            :observation="item.observation || null" :observation-private="item.observationPrivate || false"
            :practice="item.practice || null" :proposal="item.proposal || null"
            :selected-awarenesses="item.selectedAwarenesses || []"
            :selected-implementations="item.selectedImplementations || []"
            :selected-practice="item.selectedPractice || []" :stage-id="item.stageId || 'new'"
            :status="item.status || 'visible'" :user-id="item.userId" :community-members-count="communityMembersCount"
            @click="router.push({ name: 'single-entry', params: { id: item.entryId } })" />

        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.masonry-grid {
  display: flex;
  gap: 12px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.masonry-item {
  width: 100%;
  box-sizing: border-box;
}
</style>
