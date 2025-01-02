<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'IndexPage'
})

const leaderToggle = ref(true)

const habits = ref([
  {
    name: 'Follow the Recycling Rules',
    status: 'checkin',
    chat: '7',
    checkTime: '4 days',
    checkCount: '4'
  },
  {
    name: 'Returning Chairs and Desks',
    status: 'inprogress',
    chat: '7',
    checkTime: '4 days',
    checkCount: '0'
  },
  {
    name: 'Leave Room When Angry',
    status: 'completed',
    chat: '3',
    checkTime: '4 days',
    checkCount: '9'
  }
])
</script>

<template>
  <q-page class="bg-lpage q-pa-sm">
    <div
      class="bg-accent"
      style="border-radius:20px"
    >
      <q-toolbar
        class="bg-accent text-primary"
        style="border-radius:20px"
      >
        <q-avatar>
          <img src="../assets/jl-logo.svg">
        </q-avatar>

        <q-toolbar-title class="lora  text-h4 text-weight-bold">
          Juntos
        </q-toolbar-title>

        <q-btn
          filled
          round
          color="primary"
          text-color="accent"
          dense
          icon="o_group"
        />
      </q-toolbar>
      <div class="q-py-lg q-px-md nunito text-h5 text-primary">
        Share Awareness
      </div>
      <div class="q-px-md lora text-h4 text-primary">
        Hello Anatoly, what have you noticed about <span class="text-weight-bold lora text-primary">how we work and live
          together</span>?
      </div>
      <div class="q-py-lg q-px-md">
        <q-input
          v-model="text"
          rounded
          outlined
          bg-color="white"
          color="accent"
          label="I notice ..."
        >
          <template #prepend>
            <q-icon name="o_visibility" />
          </template>
        </q-input>
        <q-toggle
          v-model="leaderToggle"
          icon-color="primary"
          color="primary"
          label="Only the leader sees this"
        />
      </div>
    </div>
    <div class="q-pa-sm">
      <div class="row items-center">
        <div class="col-9 text-h5 text-weight-bold q-px-md text-primary">
          Practice Check In
        </div>
        <div class="col-3">
          <q-btn
            flat
            no-caps
            class="text-weight-bold"
            label="Show all"
            color="primary"
          />
        </div>
      </div>
      <div class="text-body1 nunito q-pl-md text-weight-light">
        Community habits we're focusing on
      </div>
    </div>
    <div class="">
      <div
        v-for="h in habits"
        :key="h.name"
        class="bg-primary q-mb-sm q-pa-sm"
        style="border-radius:10px"
      >
        <div class="row items-center">
          <div class="col-11">
            <div class="text-body1 lora text-weight-semibold text-lpage q-pa-sm q-pl-md">
              {{ h.name }}
            </div>
            <div class="q-gutter-xs q-pl-md">
              <q-chip
                dense
                icon="o_message"
                text-color="lpage-80"
                color="primary"
              >
                {{ h.chat }}
              </q-chip>
              <q-chip
                dense
                icon="o_check_circle"
                text-color="lpage-80"
                color="primary"
              >
                {{ h.checkCount }} / 14
              </q-chip>
            </div>
          </div>
          <div class="col-1">
            <q-checkbox color="white" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
