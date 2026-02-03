import http from './http'

export const createJob = (job) => http.post('/jobs/', job)

export const getJobs = (params) => http.get('/jobs/', { params, timeout: 30000 })

export const getJob = (id) => http.get(`/jobs/${id}`)

export const updateJob = (id, job) => http.put(`/jobs/${id}`, job)

export const deleteJob = (id) => http.delete(`/jobs/${id}`)

export const applyForJob = (jobId, email) =>
  http.post('/jobs/apply', null, { params: { job_id: jobId, email } })

export const getJobApplications = (jobId, params) =>
  http.get(`/jobs/${jobId}/applications`, { params })
