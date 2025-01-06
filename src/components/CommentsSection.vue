<template>
  <div class="comments-section bg-white q-pa-sm" style="border-radius: 20px;">
    <!-- Comments List -->
    <transition-group name="fade" tag="div">
      <div v-for="comment in topLevelComments" :key="comment.commentId" class="comment-item">
        <!-- Top-level comment -->
        <q-item dense>
          <q-item-section top thumbnail class="q-pr-sm">
            <UserProfileAvatar :full-name="comment.fullName" :avatar-size="24" :show-initials-only="true" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary text-weight-bold">{{ comment.username }}</q-item-label>
            <q-item-label class="text-primary-80 text-comment-detail">{{ getUserRole(comment.userId)
              }}</q-item-label>
            <q-item-label class="text-primary text-caption">{{ comment.comment }}</q-item-label>
            <q-item-label caption>
              <q-chip color="white" text-color="primary" icon="reply" dense size="xs" class="q-pa-none q-mx-none"
                label="Reply" clickable @click="toggleReplyInput(comment.commentId)" />
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption class="text-primary-50 text-comment-detail">{{ formatTimeAgo(comment.createdAt)
              }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Reply Input for Top-level Comment -->
        <div v-if="replyToCommentId === comment.commentId" class="reply-input">
          <q-item class="full-width" dense>
            <q-item-section>
              <q-input rounded standout v-model="replyText" placeholder="Write your reply..." dense clearable
                @keyup.enter="submitComment(comment.commentId)" bg-color="accent" label-color="primary"
                :input-style="{ color: '#0E3C26', fontSize: '12px' }"><template v-slot:append>
                  <q-icon name="send" class="cursor-pointer" @click="submitComment(comment.commentId)"
                    color="primary" />
                </template></q-input>
            </q-item-section>
          </q-item>
        </div>

        <!-- Replies -->
        <transition-group name="fade" tag="div">
          <div v-for="reply in getReplies(comment.commentId)" :key="reply.commentId" class="reply-item">
            <q-item>
              <q-item-section top thumbnail class="q-pr-sm">
                <UserProfileAvatar :full-name="comment.fullName" :avatar-size="24" :show-initials-only="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-primary text-weight-bold">{{ reply.username }}</q-item-label>
                <q-item-label class="text-primary-80 text-comment-detail">{{ getUserRole(reply.userId) }}</q-item-label>
                <q-item-label class="text-primary text-caption">{{ reply.comment }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label class="text-primary-50 text-comment-detail">{{ formatTimeAgo(reply.createdAt)
                  }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </transition-group>
      </div>
    </transition-group>

    <!-- Add Comment Input -->
    <div class="add-comment" v-if="!replyToCommentId">
      <q-item class="full-width">
        <q-item-section top thumbnail class="q-pr-sm">
          <UserProfileAvatar :full-name="fullName" :avatar-size="24" :show-initials-only="true" />
        </q-item-section>
        <q-item-section>
          <q-input rounded standout v-model="newComment" placeholder="Write a comment..." dense clearable
            @keyup.enter="submitComment()" bg-color="accent" label-color="primary"
            :input-style="{ color: '#0E3C26', fontSize: '12px' }"><template v-slot:append>
              <q-icon name="send" class="cursor-pointer" @click="submitComment()" color="primary" />
            </template></q-input>
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
const replyText = ref("");
const replyToCommentId = ref(null);

const fullName = authStore.profile?.fullName;

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

const submitComment = async (parentCommentId = null) => {
  const comment = parentCommentId ? replyText.value : newComment.value;
  if (!comment.trim()) return;

  const userId = authStore.profile?.userId;
  const username = authStore.profile?.username;

  await commentsStore.addComment({
    entryId: props.entryId,
    userId,
    username,
    comment: comment.trim(),
    parentCommentId,
  });

  if (parentCommentId) {
    replyToCommentId.value = null;
    replyText.value = "";
  } else {
    newComment.value = "";
  }
};

const toggleReplyInput = (commentId) => {
  replyToCommentId.value = replyToCommentId.value === commentId ? null : commentId;
};
</script>

<style scoped>
.comments-section {
  margin-bottom: 1rem;
}

.comment-item {
  margin-bottom: 1rem;
}

.reply-item {
  margin-left: 1.75rem;
  margin-top: 0rem;
}

.reply-input {
  margin-left: 1.75rem;
  margin-top: 0rem;
}

.add-comment {
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-comment-detail {
  line-height: 0.8;
  font-size: 10px;
  margin: 0px;
  padding: 0px;
}
</style>
