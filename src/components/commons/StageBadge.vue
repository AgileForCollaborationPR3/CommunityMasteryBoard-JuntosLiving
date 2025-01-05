<script setup>
import { computed, defineProps } from "vue";

// Define props
const props = defineProps({
  stageId: {
    type: String,
    required: true,
    default: "awareness",
    validator: (value) =>
      ["new", "mastery", "practicing", "implementing", "awareness"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  showText: {
    type: Boolean,
    default: true, // Whether to show the stage name alongside the icon
    required: false
  },
  active: {
    type: Boolean,
    default: false, // Whether to indicate if the stage name is selected
    required: false
  },
  opacity: {
    type: Boolean,
    default: false, // Wheter to indicate fi the badge should have lower opacity
    required: false
  }
});

// Compute the icon path based on the stageId
const iconPath = computed(() => {
  switch (props.stageId) {
    case "mastery":
      return "icons/iconMastery.svg";
    case "practicing":
      return "icons/iconPracticing.svg";
    case "implementing":
      return "icons/iconImplementing.svg";
    case "awareness":
      return "icons/iconAwareness.svg";
    default:
      return "";
  }
});

// Compute the badge background color class based on the stageId and active prop
const backgroundClass = computed(() => {
  const isOpaque = props.opacity; //
  switch (props.stageId) {
    case "mastery":
      return isOpaque ? "bg-mastery-50" : "bg-mastery";
    case "practicing":
      return isOpaque ? "bg-practicing-50" : "bg-practicing";
    case "implementing":
      return isOpaque ? "bg-implementing-50" : "bg-implementing";
    case "awareness":
      return isOpaque ? "bg-awareness-50" : "bg-awareness";
    case "new":
      return isOpaque ? "bg-secondary-50" : "bg-secondary";
    default:
      return "";
  }
});


// Compute the size class for the badge
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "size-sm";
    case "md":
      return "size-md";
    case "lg":
      return "size-lg";
    case "xl":
      return "size-xl";
    default:
      return "size-md";
  }
});

// Compute the size class for the icon
const iconSizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "icon-sm";
    case "md":
      return "icon-md";
    case "lg":
      return "icon-lg";
    case "xl":
      return "icon-xl";
    default:
      return "icon-md";
  }
});

// Compute the text for the badge
const stageText = computed(() => {
  return props.stageId.charAt(0).toUpperCase() + props.stageId.slice(1);
});
</script>

<template>
  <div :class="[
    'badge-container',
    backgroundClass,
    sizeClass,
    { 'badge-active': props.active },
    { 'rounded': true },
  ]">
    <img v-if="stageId !== 'new'" :src="iconPath" :class="['badge-icon', iconSizeClass]" alt="Stage Icon" />
    <!-- Optional Text -->
    <span v-if="showText" class="badge-text text-primary text-weight-regular nunito q-px-xs">
      {{ stageText }}
    </span>
  </div>
</template>

<style scoped>
/* Badge Container Styles */
.badge-container {
  display: inline-flex;
  justify-content: center;
  border-radius: 20px;
  padding: 4px 4px;
  gap: 0px;
  color: white;
  font-weight: bold;
}

/* Badge Active Style */
.badge-active {
  outline: 2px #0E3C26 solid;
}

/* Badge Sizes */
.size-sm {
  font-size: 12px;
  padding: 2px 2px;
}

.size-md {
  font-size: 14px;
  padding: 4px 4px;
}

.size-lg {
  font-size: 16px;
  padding: 6px 6px;
}

.size-xl {
  font-size: 18px;
  padding: 8px 8px;
}

/* Icon Sizes */
.badge-icon {
  display: block;
}

.icon-sm {
  width: 12px;
  height: 12px;
}

.icon-md {
  width: 16px;
  height: 16px;
}

.icon-lg {
  width: 24px;
  height: 24px;
}

.icon-xl {
  width: 32px;
  height: 32px;
}

/* Text Styles */
.badge-text {
  font-size: inherit;
  line-height: 1;
  white-space: nowrap;
}
</style>
