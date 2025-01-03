<script setup>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../boot/firebase"; // Adjust this path based on your project structure
import { useQuasar } from "quasar";

const $q = useQuasar();
const isLoading = ref(false);

const generateDummyEntries = () => {
  const dummyEntries = [];
  const stages = ["awareness", "practicing", "implementing", "mastery"];
  const now = new Date().toISOString();

  for (let i = 1; i <= 15; i++) {
    dummyEntries.push({
      entryId: `dummy-${i}`,
      stageId: stages[Math.floor(Math.random() * stages.length)],
      contentType: "text",
      intent: `Dummy intent ${i}`,
      observation: `This is a dummy observation ${i}.`,
      observationPrivate: Math.random() < 0.5, // Randomize visibility
      needs: [`Need ${i}-A`, `Need ${i}-B`],
      selectedAwarenesses: [],
      proposal: `Dummy proposal ${i}`,
      selectedImplementations: [],
      practice: `Dummy practice ${i}`,
      selectedPractice: [],
      mastered: `Dummy mastery ${i}`,
      status: "visible",
      userId: `user_${i}`,
      communityId: "test-11aa",
      createdAt: now,
      updatedAt: now,
    });
  }

  return dummyEntries;
};

const uploadDummyEntries = async () => {
  try {
    isLoading.value = true;
    const dummyEntries = generateDummyEntries();
    const entriesCollection = collection(db, "entries");

    // Push each entry to Firestore
    const uploadPromises = dummyEntries.map((entry) =>
      addDoc(entriesCollection, entry)
    );

    await Promise.all(uploadPromises);
    $q.notify({
      type: "positive",
      message: "Dummy entries uploaded successfully!",
    });
  } catch (error) {
    console.error("Error uploading dummy entries:", error.message);
    $q.notify({
      type: "negative",
      message: "Failed to upload dummy entries. Check the console for details.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="q-pa-lg flex flex-center min-h-90vh">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%;">
      <q-card-section>
        <div class="text-center">
          <div class="text-h5">Upload Dummy Entries</div>
          <div class="text-subtitle1">
            Push 15 dummy entries to Firestore with <strong>communityId "test-11aa"</strong>.
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-btn
          label="Upload Dummy Entries"
          color="primary"
          class="full-width"
          :loading="isLoading"
          @click="uploadDummyEntries"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
