import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getHealth = () => api.get('/health')
export const getTeams = () => api.get('/teams')
export const getTeam = (id) => api.get(`/teams/${id}`)
export const getMatchesByTeam = (teamId) => api.get(`/matches/team/${teamId}`)
export const getPrediction = (home, away) => api.get(`/predict?home=${home}&away=${away}`)
