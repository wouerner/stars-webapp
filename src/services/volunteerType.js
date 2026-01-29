import axiosInstance from '@/services/http.js'

function headers() {
  const token = localStorage.getItem('token')

  return {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

async function fetch() {
  try {
    const response = await axiosInstance.get('/volunteer-types/', { headers: headers() })

    const data = response.data

    if (data.error) {
      alert(data.error)
      return
    } else if (data.message) {
      alert(data.message)
    } else {
      return data
    }
  } catch (error) {
    alert(error)
  }
}

export default {
  fetch
}
