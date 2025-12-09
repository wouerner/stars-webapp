import axiosInstance from '@/services/http.js'

function headers () {
    const token = localStorage.getItem('token');

    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}

async function fetchStats() {
    try {
        const response = await axiosInstance.get(
            '/dashboard/stats', 
            { headers: headers() }
        );

        return response.data;
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}

export default {
    fetchStats
};
