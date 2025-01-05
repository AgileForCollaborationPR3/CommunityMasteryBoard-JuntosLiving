<template>
  <div class="comments-section">
    <div v-for="comment in topLevelComments" :key="comment.commentId" class="comment-item">
      <!-- Top-level comment -->
      <q-item>
        <q-item-section top thumbnail>
          <UserProfileAvatar :full-name="comment.fullName" :avatar-size="44" :show-initials-only="true" />
        </q-item-section>
        <q-item-section>
          <q-item-label overline>{{ comment.username }}</q-item-label>
          <q-item-label caption>{{ getUserRole(comment.userId) }}</q-item-label>
          <q-item-label>{{ comment.comment }}</q-item-label>
          <q-item-label caption>
            <q-chip label="Reply" clickable @click="startReply(comment.commentId)" />
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>{{ formatTimeAgo(comment.createdAt) }}</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Replies -->
      <div v-for="reply in getReplies(comment.commentId)" :key="reply.commentId" class="reply-item">
        <q-item>
          <q-item-section top thumbnail class="q-ml-xl">
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ reply.username }}</q-item-label>
            <q-item-label caption>{{ getUserRole(reply.userId) }}</q-item-label>
            <q-item-label>{{ reply.comment }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{ formatTimeAgo(reply.createdAt) }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <!-- Add Comment Input -->
    <div class="add-comment">
      <q-item>
        <q-item-section top thumbnail>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-input v-model="newComment" placeholder="Write a comment..." dense clearable @keyup.enter="submitComment" />
        </q-item-section>
        <q-item-section side>
          <q-btn icon="send" flat @click="submitComment" />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCommentsStore } from "../stores/comments-store";
import { useAuthCommunityStore } from "../stores/auth-community-store";
import UserProfileAvatar from "./commons/UserProfileAvatar.vue";

const props = defineProps({
  entryId: { type: String, required: true },
});

const commentsStore = useCommentsStore();
const authStore = useAuthCommunityStore();

const newComment = ref("");
const replyToCommentId = ref(null);

const topLevelComments = computed(() =>
  commentsStore.getCommentsByEntryId(props.entryId)
);

const getReplies = (commentId) =>
  commentsStore.getRepliesByCommentId(commentId);

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp.toDate()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const getUserRole = (userId) => {
  const user = authStore.profile?.userId === userId ? authStore.profile : null;
  return user?.role || "Member";
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  const userId = authStore.profile?.userId;
  const username = authStore.profile?.username;

  await commentsStore.addComment({
    entryId: props.entryId,
    userId,
    username,
    comment: newComment.value.trim(),
    parentCommentId: replyToCommentId.value || null,
  });

  replyToCommentId.value = null;
  newComment.value = "";
};

const startReply = (commentId) => {
  replyToCommentId.value = commentId;
};
</script>



<style scoped>
.comments-section {
  margin-top: 1rem;
}

.comment-item {
  margin-bottom: 1rem;
}

.reply-item {
  margin-top: 0.5rem;
  margin-left: 1.5rem;
}

.add-comment {
  margin-top: 2rem;
  display: flex;
  align-items: center;
}
</style>
