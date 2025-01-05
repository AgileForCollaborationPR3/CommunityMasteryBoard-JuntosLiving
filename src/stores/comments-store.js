import { defineStore } from "pinia";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../boot/firebase";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    comments: [], // All comments
  }),
  getters: {
    // Get comments for a specific entry
    getCommentsByEntryId: (state) => (entryId) => {
      return state.comments.filter((comment) => comment.entryId === entryId);
    },
    // Get replies for a specific comment
    getRepliesByCommentId: (state) => (commentId) => {
      return state.comments.filter(
        (comment) => comment.parentCommentId === commentId
      );
    },
  },
  actions: {
    async fetchCommentsByEntryId(entryId) {
      try {
        const q = query(
          collection(db, "comments"),
          where("entryId", "==", entryId)
        );
        const querySnapshot = await getDocs(q);
        this.comments = querySnapshot.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        }));
        return this.getCommentsByEntryId(entryId);
      } catch (error) {
        console.error("Error fetching comments:", error.message);
        throw new Error("Failed to fetch comments.");
      }
    },
    async fetchRepliesByCommentId(commentId) {
      try {
        const replies = this.getRepliesByCommentId(commentId);
        return replies;
      } catch (error) {
        console.error("Error fetching replies:", error.message);
        throw new Error("Failed to fetch replies.");
      }
    },
  },
});
