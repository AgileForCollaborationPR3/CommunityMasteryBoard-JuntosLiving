<script setup>
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../boot/firebase"; // Adjust the path to your Firebase setup
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const uploading = ref(false);

const comments = [
  {
    commentId: "1",
    entryId: "entry1",
    parentCommentId: null,
    userId: "user1",
    username: "john_doe",
    comment: "This is the first top-level comment on entry 1.",
    createdAt: "2025-01-01T12:00:00Z",
    updatedAt: "2025-01-01T12:00:00Z",
  },
  {
    commentId: "2",
    entryId: "entry1",
    parentCommentId: null,
    userId: "user2",
    username: "jane_smith",
    comment: "Another top-level comment on entry 1.",
    createdAt: "2025-01-02T14:30:00Z",
    updatedAt: "2025-01-02T14:30:00Z",
  },
  {
    commentId: "3",
    entryId: "entry1",
    parentCommentId: "1",
    userId: "user3",
    username: "charlie_brown",
    comment: "This is a reply to the first comment.",
    createdAt: "2025-01-03T10:15:00Z",
    updatedAt: "2025-01-03T10:15:00Z",
  },
  {
    commentId: "4",
    entryId: "entry2",
    parentCommentId: null,
    userId: "user4",
    username: "alice_wonderland",
    comment: "Top-level comment on entry 2.",
    createdAt: "2025-01-04T09:00:00Z",
    updatedAt: "2025-01-04T09:00:00Z",
  },
  {
    commentId: "5",
    entryId: "entry2",
    parentCommentId: "4",
    userId: "user5",
    username: "bob_builder",
    comment: "Reply to the top-level comment on entry 2.",
    createdAt: "2025-01-04T10:00:00Z",
    updatedAt: "2025-01-04T10:00:00Z",
  },
];

async function uploadComments() {
  uploading.value = true;

  try {
    for (const comment of comments) {
      const docRef = doc(collection(db, "comments"), comment.commentId);
      await setDoc(docRef, comment);
    }

    $q.notify({
      type: "positive",
      message: "Comments uploaded successfully!",
    });
  } catch (error) {
    console.error("Error uploading comments:", error.message);
    $q.notify({
      type: "negative",
      message: "Failed to upload comments.",
    });
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div>
    <q-btn color="primary" label="Upload Comments" :loading="uploading" @click="uploadComments" />
  </div>
</template>
