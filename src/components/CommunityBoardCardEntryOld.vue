<script setup>
import { defineProps, computed } from 'vue'
import UserProfileAvatarMini from './commons/UserProfileAvatarMini.vue'
import StageIconMini from './commons/StageIconMini.vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  stageId: {
    type: String,
    required: true,
    default: 'awareness',
    validator: (value) =>
      ['mastery', 'practicing', 'implementing', 'awareness'].includes(value)
  },
  contentType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'image'].includes(value)
  },
  contentCategory: {
    type: String,
    default: 'entry',
    validator: (value) => ['entry', 'comment'].includes(value)
  },
  comment: {
    type: String,
    default: ''
  },
  intent: {
    type: String,
    default: null
  },
  observation: {
    type: String,
    default: null
  },
  needs: {
    type: Array,
    default: () => []
  },
  selectedAwarenesses: {
    type: Array,
    default: () => []
  },
  proposal: {
    type: String,
    default: null
  },
  selectedImplementations: {
    type: Array,
    default: () => []
  },
  practice: {
    type: String,
    default: null
  },
  selectedPractice: {
    type: Array,
    default: () => []
  },
  mastered: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'visible',
    validator: (value) => ['visible', 'hidden'].includes(value)
  }
})

const contentCategoryClass = computed(() => {
  return props.contentCategory === 'entry' ? 'bg-secondary' : 'bg-white'
})
</script>

<template>
  <q-card :class="['dashboard__card--border-radius', contentCategoryClass]">
    <q-card-section class="row justify-between q-pa-sm">
      <UserProfileAvatarMini
        :first-name="firstName"
        :last-name="lastName"
      />
      <StageIconMini
        size="sm"
        :stage-id="stageId"
      />
    </q-card-section>
    <q-card-section v-if="contentCategory === 'comment'">
      {{ comment }}
    </q-card-section>
    <q-card-section
      v-if="contentCategory === 'entry' && stageId === 'awareness'"
      class="q-pa-sm"
    >
      {{ observation }}
    </q-card-section>
    <q-card-section
      v-if="contentCategory === 'entry' && stageId === 'implementing'"
      class="q-pa-sm"
    >
      {{ proposal }}
    </q-card-section>
    <q-card-section
      v-if="contentCategory === 'entry' && stageId === 'practicing'"
      class="q-pa-sm"
    >
      {{ practice }}
    </q-card-section>
    <q-card-section
      v-if="contentCategory === 'entry' && stageId === 'mastery'"
      class="q-pa-sm"
    >
      {{ mastered }}
    </q-card-section>
    <q-card-actions class="q-pa-sm">
      <q-btn
        label="1"
        icon="o_chat"
        size="sm"
        dense
        flat
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.dashboard__card--border-radius {
  border-radius: 10px;
}
</style>
