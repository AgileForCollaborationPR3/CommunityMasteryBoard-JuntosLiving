<script setup>
import { ref, computed } from 'vue'
import CommunityBoardCardEntry from 'src/components/CommunityBoardCardEntry.vue'
import { useEntriesStore } from '../stores/entries-store'
import { useUsersStore } from '../stores/users-store'
import { useRouter } from 'vue-router'
const entriesStore = useEntriesStore()
const usersStore = useUsersStore()
const router = useRouter()

defineOptions({
  name: 'CommunityBoardOld'
})

// Filters available on the page
const filters = ['New', 'Awareness', 'Practicing', 'Implementing', 'Mastery']
const activeFilter = ref('New')

// Horizontal scroll area style for filter
const thumbStyle = ref({
  width: '0px',
  opacity: 0
})

const barStyle = ref({
  width: '0px',
  opacity: 0
})

// Map user data to each latest item (entries and comments combined)
const mappedLatestItems = computed(() => {
  return entriesStore.combinedLatestItems.map((item) => {
    const user = usersStore.users.find((user) => user.userId === item.userId)
    return {
      ...item,
      firstName: user.firstName || 'not found firstname',
      lastName: user.lastName || 'not found lastname'
    }
  })
})

// Map user data to each entry
const mappedEntries = computed(() => {
  return entriesStore.entries.map((entry) => {
    const user = usersStore.users.find((user) => user.userId === entry.userId)
    return {
      ...entry,
      firstName: user.firstName || 'not found firstname',
      lastName: user.lastName || 'not found lastname'
    }
  })
})

// Compute items to display based on active filter
const filteredItems = computed(() => {
  if (activeFilter.value === 'New') {
    return mappedLatestItems.value
  } else {
    return mappedEntries.value.filter(
      (entry) => entry.stageId === activeFilter.value.toLowerCase()
    )
  }
})

// Split cards between two columns
const splitCards = computed(() => {
  const columns = [[], []]
  filteredItems.value.forEach((card, index) => {
    columns[index % 2].push(card)
  })
  return columns
})
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

      <div class="q-px-lg" :style="{ width: $q.screen.width, height: '32px' }">
        <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"
          :style="{ width: $q.screen.width - 48 + 'px', height: '32px' }">
          <div class="row no-wrap">
            <q-btn v-for="filter in filters" :key="filter" size="small" dense no-caps flat :label="filter"
              :color="activeFilter === filter ? 'primary' : 'grey'" class="q-mr-sm" @click="activeFilter = filter" />
          </div>
        </q-scroll-area>
      </div>
    </q-page-sticky>

    <div class="masonry-grid bg-lpage q-mt-xs" :style="{ paddingTop: '82px' }">
      <div v-for="(columnItems, columnIndex) in splitCards" :key="columnIndex" class="column">
        <div v-for="item in columnItems" :key="item.id" class="masonry-item" @click="
          router.push({
            name: 'single-entry',
            params: { id: item.entryId },
          })
          ">
          <CommunityBoardCardEntry :item-id="item.entryId || item.commentId" :first-name="item.firstName"
            :last-name="item.lastName" :stage-id="item.stageId || ''" :content-type="item.contentType || 'text'"
            :content-category="item.contentCategory || 'entry'" :comment="item.comment || ''"
            :intent="item.intent || null" :observation="item.observation || null" :needs="item.needs || []"
            :selected-awarenesses="item.selectedAwarenesses || []" :proposal="item.proposal || null"
            :selected-implementations="item.selectedImplementations || []" :practice="item.practice || null"
            :selected-practice="item.selectedPractice || []" :mastered="item.mastered || null"
            :status="item.status || 'visible'" />
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

.masonry-item>.q-card {
  width: 100%;
}
</style>
