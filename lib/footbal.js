import axios from 'axios'

const baseApiUrl = "https://v3.football.api-sports.io"


const apiFootbal = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Accept": 'application/json',
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "API_KEY",
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})

export default apiFootbal;