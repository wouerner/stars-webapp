import { defineStore } from 'pinia'
import volunteerService from '@/services/volunteer.js'
import { ref } from 'vue'

export const useVolunteerStore = defineStore('volunteer', () => {
    const currentVolunteer = ref(null); // Used for single volunteer details
    const volunteers = ref([]); // New ref for list of volunteers
    const statuses = ref([]); // To store all available statuses
    const loading = ref(false); // Add loading state

    async function fetchByEmail(email) {
        try {
            const response = await volunteerService.fetchByEmail(email);
            // The service's fetchByEmail returns error.response on error,
            // so if response has a status, it's likely an error.
            if (response && response.status) { // Assuming response is an error object here
                if (response.status === 404) {
                    throw new Error('Voluntário não encontrado');
                }
                if (response.data && response.data.detail) {
                    throw new Error(response.data.detail);
                }
                throw new Error('Erro ao buscar voluntário por e-mail.');
            }
            currentVolunteer.value = response;
        } catch (error) {
            throw error; // Re-throw the error with translated message
        }
    }

    async function create(volunteer) {
        console.log('store volunteer :', volunteer);
        try {
            const data = await volunteerService.create(volunteer);

            if (data && data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            let errorMessage = 'Um erro inesperado ocorreu.'; // Default message

            if (error.response && error.response.data && error.response.data.detail) {
                const backendDetail = error.response.data.detail;
                if (backendDetail === 'Email already registered') {
                    errorMessage = 'E-mail já registrado.';
                } else {
                    errorMessage = backendDetail; // Use the backend message if not a known one
                }
            } else if (error.message) {
                errorMessage = error.message; // Fallback to generic JS error message
            }
            
            throw new Error(errorMessage);
        }
    }

    async function fetchAll(page = 1, limit = 10, filters = {}) {
        loading.value = true; // Set loading to true
        try {
            const skip = (page - 1) * limit;
            const params = { skip, limit, ...filters };
            const response = await volunteerService.fetchAll(params);
            volunteers.value = response;
        } catch (error) {
            console.error('Erro ao buscar voluntários:', error);
            let errorMessage = 'Erro ao buscar voluntários.';
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        } finally {
            loading.value = false; // Set loading to false regardless of success or failure
        }
    }

    async function fetchStatuses() {
        try {
            statuses.value = await volunteerService.getStatuses();
        } catch (error) {
            console.error('Erro ao buscar status de voluntários:', error);
            let errorMessage = 'Erro ao buscar status de voluntários.';
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    async function fetchVolunteer(id) {
        try {
            currentVolunteer.value = await volunteerService.getById(id);
        } catch (error) {
            console.error(`Erro ao buscar voluntário ${id}:`, error);
            let errorMessage = `Erro ao buscar voluntário ${id}.`;
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    async function updateVolunteerStatus(volunteerId, newStatusId) {
        try {
            await volunteerService.updateStatus(volunteerId, newStatusId);
            // After successful update, refetch the volunteer to get the updated status and history
            await fetchVolunteer(volunteerId); 
        } catch (error) {
            console.error(`Erro ao atualizar status do voluntário ${volunteerId}:`, error);
            let errorMessage = `Erro ao atualizar status do voluntário ${volunteerId}.`;
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    async function updateVolunteerSquad(volunteerId, newSquadId) {
        try {
            await volunteerService.updateSquad(volunteerId, newSquadId);
            await fetchVolunteer(volunteerId); 
        } catch (error) {
            console.error(`Erro ao atualizar squad do voluntário ${volunteerId}:`, error);
            let errorMessage = `Erro ao atualizar squad do voluntário ${volunteerId}.`;
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    return { 
        currentVolunteer, 
        volunteers, 
        statuses,
        loading, // Expose loading state
        fetchAll,
        create,
        fetchByEmail,
        fetchStatuses,
        fetchVolunteer,
        updateVolunteerStatus,
        updateVolunteerSquad
    }
}, 
    { 
        persist: true 
    }
)
