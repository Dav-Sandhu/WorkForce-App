import axios from "axios"

export const makeRequest = async (req) => {
    const url = import.meta.env.VITE_SQLDB || '/sql'
    try {
        const res = await axios.get(url, {
            params: {
                query: req
            }
        })
        return res.data
    }catch (error) {
        console.error(`Error making request to ${url}:`, error)
        if (error.response) {
            console.error('Response data:', error.response.data)
        }
        return []
    }
}