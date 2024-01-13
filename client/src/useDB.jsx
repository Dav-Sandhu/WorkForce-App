import axios from "axios"

export const makeRequest = async (req) => {

    const url = 'https://workforce-app.azurewebsites.net/sql'

    const res = await axios.get(url, {
        params: {
            query: req
        }
    })

    return res.data
}