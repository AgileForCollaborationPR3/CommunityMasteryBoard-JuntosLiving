<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  stageId: {
    type: String,
    required: true,
    default: 'awareness',
    validator: (value) =>
      ['mastery', 'practicing', 'implementing', 'awareness'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const iconPath = computed(() => {
  switch (props.stageId) {
    case 'mastery':
      return 'icons/iconMastery.svg'
    case 'practicing':
      return 'icons/iconPracticing.svg'
    case 'implementing':
      return 'icons/iconImplementing.svg'
    case 'awareness':
      return 'icons/iconAwareness.svg'
    default:
      return ''
  }
})

const backgroundClass = computed(() => {
  switch (props.stageId) {
    case 'mastery':
      return 'bg-mastery'
    case 'practicing':
      return 'bg-practice'
    case 'implementing':
      return 'bg-implement'
    case 'awareness':
      return 'bg-aware'
    default:
      return ''
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-sm'
    case 'md':
      return 'size-md'
    case 'lg':
      return 'size-lg'
    case 'xl':
      return 'size-xl'
    default:
      return 'size-md'
  }
})

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'icon-sm'
    case 'md':
      return 'icon-md'
    case 'lg':
      return 'icon-lg'
    case 'xl':
      return 'icon-xl'
    default:
      return 'icon-md'
  }
})
</script>

<template>
  <div :class="['icon-container', backgroundClass, sizeClass]">
    <img
      :src="iconPath"
      :class="['icon', iconSizeClass]"
      alt="Icon"
    >
  </div>
</template>

<style scoped>
.icon-container {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-sm {
  width: 20px;
  height: 20px;
}

.size-md {
  width: 24px;
  height: 24px;
}

.size-lg {
  width: 36px;
  height: 36px;
}

.size-xl {
  width: 48px;
  height: 48px;
}

.icon {
  display: block;
}

.icon-sm {
  width: 14px;
  height: 14px;
}

.icon-md {
  width: 18px;
  height: 18px;
}

.icon-lg {
  width: 28px;
  height: 28px;
}

.icon-xl {
  width: 36px;
  height: 36px;
}
</style>
