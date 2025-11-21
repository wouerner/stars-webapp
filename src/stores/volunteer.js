import { defineStore } from 'pinia'
import volunteerService from '@/services/volunteer.js'
import { ref } from 'vue'

export const useVolunteerStore = defineStore('volunteer', () => {
    const volunteer = ref([]); // Used for single volunteer details
    const volunteers = ref([]); // New ref for list of volunteers

    async function fetchByEmail(email) {
        try {
            const response = await volunteerService.fetchByEmail(email);
            const data = response;
            console.log('data :', data);

            if (data.status === 404) {
                alert('Volunteer não encontrado')
                return;
            }

            volunteer.value = data
           
        } catch (error) {
            alert('Catch: ' + error)
        }
    }

    async function create(volunteer) {
        console.log('store volunteer :', volunteer);
        try {
            const response = await volunteerService.create(volunteer);
            const data = response;

            if (data.error) {
                alert(data.error)
                return;
            } 
        } catch (error) {
            alert('Catch: ' + error)
        }
    }

    async function fetchAll() {
        try {
            const response = await volunteerService.fetchAll(); // Assuming this will be added to service
            volunteers.value = response;
        } catch (error) {
            alert('Erro ao buscar voluntários: ' + error);
        }
    }

    return { 
        volunteer, 
        volunteers, 
        fetchAll,
        create,
        fetchByEmail
    }
}, 
    { 
        persist: true 
    }
)
