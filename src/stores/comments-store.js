import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../boot/firebase";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    comments: [], // All comments
  }),
  getters: {
    getCommentsByEntryId: (state) => (entryId) =>
      state.comments.filter(
        (comment) => comment.entryId === entryId && !comment.parentCommentId
      ),
    getRepliesByCommentId: (state) => (commentId) =>
      state.comments.filter((comment) => comment.parentCommentId === commentId),
  },
  actions: {
    async fetchCommentsByEntryId(entryId) {
      try {
        const q = query(
          collection(db, "comments"),
          where("entryId", "==", entryId)
        );
        const querySnapshot = await getDocs(q);

        this.comments = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const comment = docSnapshot.data();

            // Correctly fetch user data
            const userRef = doc(db, "profiles", comment.userId); // Create a document reference
            const userDoc = await getDoc(userRef);
            const user = userDoc.exists()
              ? userDoc.data()
              : { fullName: "Unknown User", role: "Member" };

            return {
              commentId: docSnapshot.id,
              ...comment,
              fullName: user.fullName,
              role: user.role,
            };
          })
        );

        return this.getCommentsByEntryId(entryId);
      } catch (error) {
        console.error("Error fetching comments:", error.message);
        throw new Error(error.message || "Failed to fetch comments.");
      }
    },

    async addComment({
      entryId,
      userId,
      username,
      comment,
      parentCommentId = null,
    }) {
      try {
        const newComment = {
          entryId,
          userId,
          username,
          comment,
          parentCommentId,
          createdAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, "comments"), newComment);
        this.comments.push({ commentId: docRef.id, ...newComment });
      } catch (error) {
        console.error("Error adding comment:", error.message);
        throw new Error("Failed to add comment.");
      }
    },
  },
});
