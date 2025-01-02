<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'MainLayout'
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated>
      <q-toolbar class="bg-primary text-white justify-around q-pb-sm">
        <q-btn
          flat
          icon="o_home"
          color="secondary"
          size="md"
          @click="router.push('/')"
        />
        <q-btn
          flat
          icon="o_dashboard"
          color="secondary"
          size="md"
          @click="router.push('/board')"
        />
        <div
          class="bg-secondary q-ma-sm flex flex-center"
          style="border-radius: 14px; width: 36px; height: 36px"
        >
          <q-btn
            class="q-pa-none q-ma-none"
            flat
            icon="o_add"
            color="primary"
            size="md"
            @click="router.push('/add')"
          />
        </div>
        <q-btn
          flat
          icon="o_message"
          color="secondary"
          size="md"
          @click="router.push('/inbox')"
        />
        <q-btn
          flat
          icon="o_person"
          color="secondary"
          size="md"
          @click="router.push('/profile')"
        />
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
