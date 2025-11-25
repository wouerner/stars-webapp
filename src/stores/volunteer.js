import { defineStore } from 'pinia'
import volunteerService from '@/services/volunteer.js'
import { ref } from 'vue'

export const useVolunteerStore = defineStore('volunteer', () => {
    const currentVolunteer = ref(null); // Used for single volunteer details
    const volunteers = ref([]); // New ref for list of volunteers
    const statuses = ref([]); // To store all available statuses

    async function fetchByEmail(email) {
        try {
            const response = await volunteerService.fetchByEmail(email);
            const data = response;
            console.log('data :', data);

            if (data.status === 404) {
                alert('Volunteer não encontrado')
                return;
            }

            currentVolunteer.value = data;
           
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

    async function fetchAll(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const params = { skip, limit, ...filters };
            const response = await volunteerService.fetchAll(params);
            volunteers.value = response;
        } catch (error) {
            console.error('Erro ao buscar voluntários:', error);
            alert('Erro ao buscar voluntários: ' + error);
        }
    }

    async function fetchStatuses() {
        try {
            statuses.value = await volunteerService.getStatuses();
        } catch (error) {
            console.error('Erro ao buscar status de voluntários:', error);
            alert('Erro ao buscar status de voluntários: ' + error);
        }
    }

    async function fetchVolunteer(id) {
        try {
            currentVolunteer.value = await volunteerService.getById(id);
        } catch (error) {
            console.error(`Erro ao buscar voluntário ${id}:`, error);
            alert(`Erro ao buscar voluntário ${id}: ` + error);
        }
    }

    async function updateVolunteerStatus(volunteerId, newStatusId) {
        try {
            await volunteerService.updateStatus(volunteerId, newStatusId);
            // After successful update, refetch the volunteer to get the updated status and history
            await fetchVolunteer(volunteerId); 
        } catch (error) {
            console.error(`Erro ao atualizar status do voluntário ${volunteerId}:`, error);
            alert(`Erro ao atualizar status do voluntário ${volunteerId}: ` + error);
        }
    }

    return { 
        currentVolunteer, 
        volunteers, 
        statuses,
        fetchAll,
        create,
        fetchByEmail,
        fetchStatuses,
        fetchVolunteer,
        updateVolunteerStatus
    }
}, 
    { 
        persist: true 
    }
)
