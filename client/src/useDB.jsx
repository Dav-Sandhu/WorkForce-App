import axios from "axios"

export const makeRequest = async (req) => {

    const url = import.meta.env.VITE_SQLDB || '/sql'

    const res = await axios.get(url, {
        params: {
            query: req
        }
    })

    return res.data
}