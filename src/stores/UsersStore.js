import { defineStore } from 'pinia'
import dataUsers from '../data/users.json'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: dataUsers
  }),
  getters: {},
  actions: {}
})
