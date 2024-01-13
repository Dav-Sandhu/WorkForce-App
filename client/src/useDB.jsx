import axios from "axios"

export const makeRequest = async (req) => {

    const res = await axios.get(`https://workforce-app.azurewebsites.net`, {
        params: {
            query: req
        }
    })

    return res.data
}