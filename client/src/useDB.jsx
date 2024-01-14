import axios from "axios"

export const makeRequest = async (req) => {

    const url = import.meta.env.VITE_SQLDB || 'https://workforce-app.azurewebsites.net/sql'

    const res = await axios.get(url, {
        params: {
            query: req
        }
    })

    return res.data
}