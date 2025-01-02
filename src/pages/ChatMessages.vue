<script setup>
defineOptions({
  name: 'ChatMessages'
})
</script>

<template>
  <q-page class="bg-lpage q-pa-sm">
    <q-page-sticky
      position="top-left"
      :offset="[0, 0]"
      style="z-index: 3"
      class="bg-lpage"
    >
      <q-toolbar
        class="text-primary"
        style="border-radius: 20px"
      >
        <q-toolbar-title class="lora text-h6 text-weight-bold">
          My Messages
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>

    <div
      class="bg-lpage q-mt-xs q-px-sm"
      :style="{ paddingTop: '52px' }"
    >
      dfsd
    </div>
  </q-page>
</template>
