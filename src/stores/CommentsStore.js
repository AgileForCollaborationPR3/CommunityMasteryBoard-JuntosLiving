import { defineStore } from 'pinia'
import dataComments from '../data/comments.json'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: dataComments
  }),
  getters: {},
  actions: {}
})
