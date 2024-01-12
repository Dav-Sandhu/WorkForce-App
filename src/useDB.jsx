import axios from "axios"

export const makeRequest = async (req) => {
    const res = await axios.get(`http://localhost:3000/sql`, {
        params: {
            query: req
        }
    })

    return res.data
}