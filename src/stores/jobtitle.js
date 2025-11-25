import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
import { useSnackbarStore } from './snackbar.js'
import jobtitleService from '@/services/jobtitle.js'

export const useJobtitleStore = defineStore('jobtitle', () => {
    const tt  = useAuthStore()
    const data = ref([])

    const useSnackbar = useSnackbarStore()

    async function fetchJobtitles() {
        data.value = await jobtitleService.fetch()
        return data.value
    }

    return { 
        fetchJobtitles,
        data
    }
}, 
    { 
        persist: true 
    }
)
