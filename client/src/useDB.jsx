import axios from "axios"

export const makeRequest = async (req, url, token) => {

    const res = token ? await axios.get(url, {
        headers: {
            authorization: token.token
        },
        params: {
            query: req
        }
    }) : await axios.post(url, { data: req })

    return res.data

}