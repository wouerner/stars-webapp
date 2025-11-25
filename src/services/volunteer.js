import axiosInstance from '@/services/http.js'

function headers () {
    const token = localStorage.getItem('token');

    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}

async function fetchBy(uuidSquad) {
    try {
        const response = await axiosInstance.get(
            '/squad/' + uuidSquad + '/members', 
            { headers: headers() }
        );

        const data = response.data;

        if (data.error) {
            alert(data.error)
            return;
        } else {
            return data
        }
    }
    catch (error) {
        alert(error)
    }
}

async function fetchByEmail(email) {
    try {
        const response = await axiosInstance.get(
            '/volunteer/' + email, 
            { headers: headers() }
        );

        const data = response.data;

        // if (data.error) {
        //     alert(data.error)
        //     return;
        // } else {
            return data
        // }
    }
    catch (error) { 
        console.log('error :', error);
        return error.response
    }
}

async function create(volunteer) {
    console.log('volunteer :', volunteer);
    try {
        const response = await axiosInstance.post(
            '/volunteer', 
            volunteer,
            { headers: headers() }
        );

        const data = response.data;

        if (data.error) {
            alert(data.error)
            return;
        } else {
            return data
        }
    }
    catch (error) {
        alert(error)
    }
}

async function update(member) {
    try {
        const response = await axiosInstance.put(
            '/squad/' + member.squad_uuid + '/member/' + member.uuid, 
            member,
            { headers: headers() }
        );

        const data = response.data;

        if (data.error) {
            alert(data.error)
            return;
        } else {
            return data
        }
    }
    catch (error) {
        alert(error)
    }
}

async function del(uuidSquad, uuidMember) {
    try {
        const response = await axiosInstance.delete(
            '/squad/' + uuidSquad + '/member/' + uuidMember, 
            { headers: headers() }
        );

        const data = response.data;

        if (data.error) {
            alert(data.error)
            return;
        } else {
            return data
        }
    }
    catch (error) {
        alert(error)
    }
}

async function fetchAll(params = {}) {
    try {
        const response = await axiosInstance.get(
            '/volunteers/',
            { 
                headers: headers(),
                params
            }
        );
        return response.data;
    } catch (error) {
        alert('Error fetching all volunteers: ' + error);
        console.error('Error fetching all volunteers:', error);
        return [];
    }
}

async function getStatuses() {
    try {
        const response = await axiosInstance.get('/volunteer-statuses/', { headers: headers() });
        return response.data;
    } catch (error) {
        console.error('Error fetching volunteer statuses:', error);
        throw error;
    }
}

async function getById(volunteerId) {
    try {
        const response = await axiosInstance.get(`/volunteers/${volunteerId}`, { headers: headers() });
        return response.data;
    } catch (error) {
        console.error(`Error fetching volunteer with ID ${volunteerId}:`, error);
        throw error;
    }
}

async function updateStatus(volunteerId, newStatusId) {
    try {
        const response = await axiosInstance.patch(
            `/volunteers/${volunteerId}/status`, 
            { new_status_id: newStatusId },
            { 
                headers: headers()
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating status for volunteer ID ${volunteerId}:`, error);
        throw error;
    }
}

export default {
    fetchBy,
    del,
    create, 
    update,
    fetchByEmail,
    fetchAll,
    getStatuses,
    getById,
    updateStatus
};
