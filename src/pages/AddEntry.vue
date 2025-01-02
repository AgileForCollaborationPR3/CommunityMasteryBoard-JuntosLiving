<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useEntriesStore } from "../stores/EntriesStore";
import { useQuasar } from "quasar";
import StageIconMini from "../components/commons/StageIconMini.vue";

const $q = useQuasar();
const router = useRouter();
const entriesStore = useEntriesStore();

// Tab State
const tab = ref("type");
const entryType = ref(null);
const inputValue = ref(""); // Temporary input value
const formData = ref({
  intent: null,
  observation: "",
  needs: [],
  practice: "",
  proposal: "",
  mastered: "",
  selectedAwareness: [],
  selectedProposals: [],
  selectedPractices: [],
});

// Navigation handlers
const close = () => {
  router.push("/board");
};

// Awareness - Add a chip to the list
const addChip = () => {
  const trimmedValue = inputValue.value.trim();
  if (trimmedValue && !formData.value.needs.includes(trimmedValue)) {
    formData.value.needs.push(trimmedValue); // Add to the array
    inputValue.value = ""; // Clear the input
  }
};

// Awareness - Remove a chip by index
const removeChip = (index) => {
  formData.value.needs.splice(index, 1);
};

// Implementing - Filter Visible Awareness Observations
const error = ref("");

// Filtered and sorted awarenesses
const filteredAwarenesses = computed(() =>
  entriesStore.entries
    .filter(
      (entry) => entry.stageId === "awareness" && entry.status === "visible"
    )
    .map((entry) => ({
      label: entry.observation,
      entryId: entry.entryId, // Use entryId instead of value
    }))
);

// Sort selected awarenesses to appear at the top
const sortedAwarenesses = computed(() => {
  const selected = formData.value.selectedAwareness;
  console.log("selected: " + formData.value.selectedAwareness);
  return filteredAwarenesses.value.sort((a, b) => {
    if (selected.includes(a.entryId) && !selected.includes(b.entryId)) {
      return -1;
    }
    if (!selected.includes(a.entryId) && selected.includes(b.entryId)) return 1;
    return 0;
  });
});

// Map selected awareness IDs to their labels
const selectedAwarenessLabels = computed(() => {
  return formData.value.selectedAwareness.map((id) => {
    const awareness = filteredAwarenesses.value.find(
      (item) => item.entryId === id
    );
    return awareness ? awareness.label : "Unknown Awareness";
  });
});

// Toggle selection for awareness
const toggleAwareness = (entryId) => {
  console.log("toggle awareness");
  const index = formData.value.selectedAwareness.indexOf(entryId);
  console.log("toggle awareness");
  console.log(index);
  if (index === -1) {
    // Add awareness if not already selected
    if (formData.value.selectedAwareness.length < 5) {
      formData.value.selectedAwareness.push(entryId);
      error.value = ""; // Clear error
    } else {
      error.value = "You can select up to 5 awarenesses only.";
    }
  } else {
    // Remove awareness if already selected
    formData.value.selectedAwareness.splice(index, 1);
    error.value = ""; // Clear error
  }
};

// Custom scrollbar styles
const thumbStyle = {
  width: "0px",
};

const barStyle = {
  width: "0px",
};

// implementing -- Filter proposals

const filteredProposals = computed(() =>
  entriesStore.entries.filter(
    (entry) => entry.stageId === "implementing" && entry.status === "visible"
  )
);

// Toggle proposal selection
const toggleProposal = (entryId) => {
  const index = formData.value.selectedProposals.indexOf(entryId);
  if (index === -1) {
    formData.value.selectedProposals.push(entryId);

    // Pre-fill practice text if one proposal is selected
    if (formData.value.selectedProposals.length === 1) {
      const proposal = filteredProposals.value.find(
        (p) => p.entryId === entryId
      );
      formData.value.practice = proposal?.proposal || "";
    } else {
      // Merge selected proposals into practice text
      formData.value.practice = formData.value.selectedProposals
        .map((id) => {
          const proposal = filteredProposals.value.find(
            (p) => p.entryId === id
          );
          return proposal?.proposal || "";
        })
        .join("\n");
    }
  } else {
    formData.value.selectedProposals.splice(index, 1);

    // Update practice text after deselection
    if (formData.value.selectedProposals.length === 1) {
      const remainingProposal = filteredProposals.value.find(
        (p) => p.entryId === formData.value.selectedProposals[0]
      );
      formData.value.practice = remainingProposal?.content || "";
    } else if (formData.value.selectedProposals.length > 1) {
      formData.value.practice = formData.value.selectedProposals
        .map((id) => {
          const proposal = filteredProposals.value.find(
            (p) => p.entryId === id
          );
          return proposal?.content || "";
        })
        .join("\n\n");
    } else {
      formData.value.practice = ""; // Clear text if no proposals remain
    }
  }
};

// Map selected proposal IDs to their labels
const selectedProposalLabels = computed(() => {
  return formData.value.selectedProposals.map((id) => {
    const proposal = filteredProposals.value.find(
      (item) => item.entryId === id
    );
    return proposal ? proposal.proposal : "Unknown Proposal";
  });
});

// Mastery - Filter practices

const filteredPractices = computed(() =>
  entriesStore.entries.filter(
    (entry) => entry.stageId === "practicing" && entry.status === "visible"
  )
);

const selectedPracticeLabels = computed(() => {
  return formData.value.selectedPractices.map((id) => {
    const practice = filteredPractices.value.find(
      (item) => item.entryId === id
    );
    return practice ? practice.practice : "Unknown Practice";
  });
});

const togglePractice = (entryId) => {
  const index = formData.value.selectedPractices.indexOf(entryId);

  if (index === -1) {
    formData.value.selectedPractices.push(entryId);

    // Pre-fill mastered text if one practice is selected
    if (formData.value.selectedPractices.length === 1) {
      const practice = filteredPractices.value.find(
        (p) => p.entryId === entryId
      );
      formData.value.mastered = practice?.practice || "";
    } else {
      // Merge selected practices into mastered text
      formData.value.mastered = formData.value.selectedPractices
        .map((id) => {
          const practice = filteredPractices.value.find(
            (p) => p.entryId === id
          );
          return practice?.practice || "";
        })
        .join("\n\n");
    }
  } else {
    formData.value.selectedPractices.splice(index, 1);

    // Update mastered text after deselection
    if (formData.value.selectedPractices.length === 1) {
      const remainingPractice = filteredPractices.value.find(
        (p) => p.entryId === formData.value.selectedPractices[0]
      );
      formData.value.mastered = remainingPractice?.practice || "";
    } else if (formData.value.selectedPractices.length > 1) {
      formData.value.mastered = formData.value.selectedPractices
        .map((id) => {
          const practice = filteredPractices.value.find(
            (p) => p.entryId === id
          );
          return practice?.practice || "";
        })
        .join("\n\n");
    } else {
      formData.value.mastered = ""; // Clear text if no practices remain
    }
  }
};

// Submit the new entry to the store
const submitEntry = () => {
  const newEntry = {
    entryId: Date.now().toString(), // Example unique ID
    userId: "current_user_id", // Replace with actual user ID from auth
    stageId: entryType.value,
    contentType: "text",
    content: {
      intent: formData.value.intent,
      observation: formData.value.observation,
      needs: formData.value.needs,
      practice: formData.value.practice,
      proposal: formData.value.proposal,
      selectedAwareness: formData.value.selectedAwareness,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  entriesStore.entries.push(newEntry);

  $q.dialog({
    title: "Thank You!",
    message: "Your entry has been added to the community board.",
    ok: "Close",
  }).onOk(() => {
    router.push("/board");
  });
};
</script>

<template>
  <q-page padding>
    <q-toolbar>
      <q-btn icon="close" flat dense @click="close" />
      <q-toolbar-title>Add Entry</q-toolbar-title>
    </q-toolbar>

    <q-tabs
      v-model="tab"
      align="justify"
      dense
      class="text-secondary"
      active-color="primary"
    >
      <q-tab name="type" label="Select Stage" no-caps />
      <q-tab name="form" label="Add Details" no-caps :disable="!entryType" />
      <q-tab
        name="submit"
        label="Add Entry"
        no-caps
        :disable="!formData.intent && !formData.practice && !formData.proposal"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="type">
        <div class="text-primary-80 text-body2 text-center q-mt-md">
          Select your entry stage
        </div>
        <q-card
          v-for="type in ['awareness', 'implementing', 'practicing', 'mastery']"
          :key="type"
          class="bg-accent q-mx-md q-mb-lg q-mt-lg"
          flat
          style="border-radius: 20px"
          clickable
          @click="
            entryType = type;
            tab = 'form';
          "
        >
          <q-card-section horizontal class="items-center">
            <q-card-actions vertical class="justify-around q-px-md">
              <StageIconMini size="lg" :stage-id="type" />
            </q-card-actions>
            <div class="text-h5 text-primary">
              {{
                type
                  ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
                  : ""
              }}
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Add Details Awareness -->
      <q-tab-panel name="form">
        <q-form v-if="entryType === 'awareness'">
          <q-select
            v-model="formData.intent"
            class="q-py-sm"
            :options="[
              {
                label: 'Desire or possible upgrade to discuss',
                value: 'desire',
                icon: 'verified_user',
              },
              {
                label: 'Challenge or concern to discuss',
                value: 'challenge',
                icon: 'gpp_bad',
              },
            ]"
            label="Share intent of the awareness"
            stack-label
          >
            <template #selected-item="scope">
              <q-chip
                dense
                :tabindex="scope.tabindex"
                color="accent"
                text-color="primary"
                @remove="scope.removeAtIndex(scope.index)"
              >
                <q-avatar
                  color="bg-accent"
                  text-color="primary"
                  :icon="scope.opt.icon"
                />
                {{ scope.opt.label }}
              </q-chip>
            </template>
          </q-select>
          <q-input
            v-model="formData.observation"
            class="q-py-sm"
            label="What is the original awareness or observation?"
          />

          <q-input
            v-model="inputValue"
            label="Add underlying need/value/desire"
            class="q-py-sm q-mb-md"
            clearable
            @keyup.enter="addChip"
          />

          <div class="q-mb-xl">
            <q-chip
              v-for="(chip, index) in formData.needs"
              :key="index"
              removable
              color="accent"
              text-color="primary"
              @remove="removeChip(index)"
            >
              {{ chip }}
            </q-chip>
          </div>
        </q-form>

        <!-- Add Details Implementing -->
        <q-form v-if="entryType === 'implementing'">
          <div>
            <p class="text-primary text-body1 nunito q-mt-md">
              Select the community observations you want to address
            </p>

            <q-scroll-area
              class="custom-scroll-area"
              :style="{
                maxHeight: '350px',
                height: sortedAwarenesses.length * 55 + 55 + 'px',
              }"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <div class="custom-chip-container">
                <div
                  v-for="(awareness, index) in sortedAwarenesses"
                  :key="awareness.entryId"
                  v-ripple:teal-10
                  :class="[
                    'custom-chip',
                    'v-ripple',
                    'relative-position',
                    formData.selectedAwareness.includes(awareness.entryId)
                      ? 'selected'
                      : 'unselected',
                  ]"
                  @click="toggleAwareness(awareness.entryId)"
                >
                  {{ awareness.label }}
                </div>
              </div>
            </q-scroll-area>

            <p v-if="error" class="text-red">
              {{ error }}
            </p>

            <q-input
              v-model="formData.proposal"
              type="textarea"
              label="Describe your proposal"
              class="text-primary q-mb-xl"
            />
          </div>
        </q-form>

        <!-- Add Details Practicing -->
        <q-form v-if="entryType === 'practicing'">
          <div>
            <p class="text-primary text-body1 nunito q-mt-md">
              Select one or more proposals to build your practice
            </p>
            <p
              v-if="formData.selectedProposals.length > 0"
              class="text-primary text-caption q-my-none"
            >
              {{ formData.selectedProposals.length }} proposal(s) selected.
            </p>
            <q-scroll-area
              class="custom-scroll-area"
              :style="{
                maxHeight: '350px',
                height: filteredProposals.length * 55 + 55 + 'px',
              }"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <div class="custom-chip-container">
                <div
                  v-for="(proposal, index) in filteredProposals"
                  :key="proposal.entryId"
                  v-ripple:teal-10
                  :class="[
                    'custom-chip',
                    'v-ripple',
                    'relative-position',
                    formData.selectedProposals.includes(proposal.entryId)
                      ? 'selected'
                      : 'unselected',
                  ]"
                  @click="toggleProposal(proposal.entryId)"
                >
                  {{ proposal.proposal }}
                </div>
              </div>
            </q-scroll-area>

            <p class="text-primary text-body1 nunito q-mt-md q-mb-none">
              Build your practice
            </p>
            <div v-if="formData.selectedProposals.length">
              <q-input
                v-model="formData.practice"
                type="textarea"
                class="text-primary q-mb-xl"
                :placeholder="`Combine selected proposals into one practice. Edit as needed.`"
                autogrow
              />
            </div>
          </div>
        </q-form>

        <!-- Add Details Mastery -->
        <q-form v-if="entryType === 'mastery'">
          <div>
            <p class="text-primary text-body1 nunito q-mt-md">
              Select one or more practices to build your mastery
            </p>
            <p
              v-if="formData.selectedPractices.length > 0"
              class="text-primary text-caption q-my-none"
            >
              {{ formData.selectedPractices.length }} practice(s) selected.
            </p>
            <q-scroll-area
              class="custom-scroll-area"
              :style="{
                maxHeight: '350px',
                height: filteredPractices.length * 55 + 55 + 'px',
              }"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <div class="custom-chip-container">
                <div
                  v-for="(practice, index) in filteredPractices"
                  :key="practice.entryId"
                  v-ripple:teal-10
                  :class="[
                    'custom-chip',
                    'v-ripple',
                    'relative-position',
                    formData.selectedPractices.includes(practice.entryId)
                      ? 'selected'
                      : 'unselected',
                  ]"
                  @click="togglePractice(practice.entryId)"
                >
                  {{ practice.practice }}
                </div>
              </div>
            </q-scroll-area>

            <p class="text-primary text-body1 nunito q-mt-md q-mb-none">
              Build your mastery
            </p>
            <div v-if="formData.selectedPractices.length">
              <q-input
                v-model="formData.mastered"
                type="textarea"
                class="text-primary q-mb-xl"
                :placeholder="`Combine selected practices into one mastery. Edit as needed.`"
                autogrow
              />
            </div>
          </div>
        </q-form>

        <q-btn
          class="full-width"
          label="Next"
          color="primary"
          @click="tab = 'submit'"
        />
      </q-tab-panel>

      <!-- Submit -->
      <q-tab-panel name="submit">
        <q-card
          class="q-px-md q-py-sm bg-accent q-mt-md q-mb-xl"
          style="border-radius: 20px"
        >
          <div
            class="text-h6 text-primary text-weight-bold lora q-pt-md q-pb-lg"
          >
            Review Your Submission
          </div>

          <div v-if="entryType === 'awareness'" class="text-primary">
            <p class="text-caption q-mb-none">Intent</p>
            <q-chip dense color="white" text-color="primary">
              <q-avatar
                color="white"
                text-color="primary"
                :icon="formData.intent.icon"
              />
              {{ formData.intent.label }}
            </q-chip>

            <p class="text-caption q-mb-none q-mt-md">Observation</p>
            <p class="text-primary text-weight-bold">
              {{ formData.observation }}
            </p>

            <p class="text-caption q-mb-none q-mt-md">
              Underlying desires, needs & values
            </p>
            <q-list dense class="q-mb-md">
              <q-item v-for="need in formData.needs" :key="need">
                <q-item-section class="text-primary text-weight-bold">
                  {{ need }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-if="entryType === 'implementing'">
            <p class="text-caption q-mb-none q-mt-md">
              The community observations addressed are:
            </p>
            <div class="custom-chip-container">
              <div
                v-for="awareness in selectedAwarenessLabels"
                :key="awareness"
                class="custom-chip"
              >
                {{ awareness }}
              </div>
            </div>
            <p class="text-caption q-mb-none q-mt-md">
              My new community practice idea is:
            </p>
            <p class="text-primary text-weight-bold">
              {{ formData.proposal }}
            </p>
          </div>

          <div v-if="entryType === 'practicing'">
            <p class="text-caption q-mb-none q-mt-md">
              The community proposals you selected and/or combined are:
            </p>
            <div class="custom-chip-container">
              <div
                v-for="proposal in selectedProposalLabels"
                :key="proposal"
                class="custom-chip"
              >
                {{ proposal }}
              </div>
            </div>
            <p class="text-caption q-mb-none q-mt-md">
              My new community practice idea is:
            </p>
            <p class="text-primary text-weight-bold">
              {{ formData.practice }}
            </p>
          </div>

          <!-- Submit Mastery -->
          <div v-if="entryType === 'mastery'">
            <p class="text-caption q-mb-none q-mt-md">
              The community practices you selected and/or combined are:
            </p>
            <div class="custom-chip-container">
              <div
                v-for="practice in selectedPracticeLabels"
                :key="practice"
                class="custom-chip"
              >
                {{ practice }}
              </div>
            </div>
            <p class="text-caption q-mb-none q-mt-md">
              My new mastery idea is:
            </p>
            <p class="text-primary text-weight-bold">
              {{ formData.mastered }}
            </p>
          </div>
        </q-card>

        <q-btn
          class="full-width"
          label="Submit"
          color="primary"
          @click="submitEntry()"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style scoped>
q-toolbar {
  justify-content: space-between;
}

/* Scroll Area Styles */
.custom-scroll-area {
  position: relative; /* Constrain absolute children */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Disable horizontal scrolling */
}

/* Container for the chips */
.custom-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Spacing between chips */
  padding: 8px;
  width: 100%;
}

/* Default chip styling */
.custom-chip {
  display: flex;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  white-space: normal; /* Allow wrapping */
  word-break: break-word; /* Ensure long words break */
  background-color: #ffffff; /* Default background */
  border: 1px solid var(--q-primary);
  color: var(--q-primary);
  position: relative; /* For ripple effect */
  overflow: hidden; /* Prevent ripple overflow */
}

/* Selected chip styling */
.custom-chip.selected {
  background-color: var(--q-accent);
  color: #0e3c26;
  border: none;
  text-align: left;
}
</style>
