import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'day',
    notification: null,
    notifTimeout: null,
  }),

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'day' ? 'night' : 'day'
      document.documentElement.setAttribute('data-theme', this.theme)
      localStorage.setItem('theme', this.theme)
    },

    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },

    showNotif(msg, type = 'success') {
      if (this.notifTimeout) clearTimeout(this.notifTimeout)
      this.notification = { msg, type }
      this.notifTimeout = setTimeout(() => {
        this.notification = null
      }, 3500)
    },
  },
})
