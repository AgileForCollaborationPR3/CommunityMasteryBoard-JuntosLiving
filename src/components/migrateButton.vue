<script setup>
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../boot/firebase";
import { useQuasar } from "quasar";

const $q = useQuasar();

async function migratePublicProfiles() {
  try {
    const profilesSnap = await getDocs(collection(db, "profiles"));
    const migrationResults = [];

    for (const docSnap of profilesSnap.docs) {
      const data = docSnap.data();

      const publicProfile = {
        userId: data.userId,
        fullName: data.fullName,
        username: data.username,
      };

      await setDoc(doc(db, "publicProfiles", data.userId), publicProfile);
      migrationResults.push(`Migrated: ${data.userId}`);
    }

    console.log("Migration completed:", migrationResults);
    return "Migration successful!";
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw new Error("Migration failed. Check console for details.");
  }
}

function runMigration() {
  migratePublicProfiles()
    .then((result) => {
      $q.notify({
        type: "positive",
        message: result,
        position: "top",
      });
    })
    .catch((error) => {
      $q.notify({
        type: "negative",
        message: error.message,
        position: "top",
      });
    });
}
</script>

<template>
  <q-btn flat label="Migrate Public Profiles" color="primary" @click="runMigration" class="q-mt-md" />
</template>
