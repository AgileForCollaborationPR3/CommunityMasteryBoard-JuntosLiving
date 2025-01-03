<script setup>
import { ref, computed, onMounted } from 'vue';
import CommunityBoardCardEntry from 'src/components/CommunityBoardCardEntry.vue';
import { useEntriesStore } from '../stores/entriesStore';
import { useAuthCommunityStore } from '../stores/auth-community-store';
import { useRouter } from 'vue-router';

const entriesStore = useEntriesStore();
const authCommunityStore = useAuthCommunityStore();
const router = useRouter();

const filters = ['New', 'Awareness', 'Practicing', 'Implementing', 'Mastery'];
const activeFilter = ref('New');

const filteredItems = computed(() => {
  if (activeFilter.value === 'New') {
    return entriesStore.combinedLatestItems;
  } else {
    return entriesStore.entries.filter(
      (entry) => entry.stageId === activeFilter.value.toLowerCase(),
    );
  }
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
    const currentCommunityId = authCommunityStore.profile?.currentCommunityId;
    if (!currentCommunityId) {
      router.push('/community'); // Redirect if no community selected
      return;
    }

    await entriesStore.fetchEntries(currentCommunityId);
  } catch (error) {
    console.error('Error loading community board:', error.message);
  }
});
</script>

<template>
  <q-page class="bg-lpage q-px-sm">
    <q-toolbar class="q-mb-md">
      <q-toolbar-title>Community Board</q-toolbar-title>
    </q-toolbar>
    <div class="row no-wrap q-mb-md">
      <q-btn
        v-for="filter in filters"
        :key="filter"
        size="small"
        dense
        flat
        :label="filter"
        :color="activeFilter === filter ? 'primary' : 'grey'"
        class="q-mr-sm"
        @click="activeFilter = filter"
      />
    </div>
    <div class="masonry-grid">
      <div
        v-for="(columnItems, columnIndex) in splitCards"
        :key="columnIndex"
        class="column"
      >
        <div
          v-for="item in columnItems"
          :key="item.entryId"
          class="masonry-item"
        >
          <CommunityBoardCardEntry v-bind="item" />
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