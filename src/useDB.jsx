import axios from "axios"

export const makeRequest = async (req) => {
    await axios.post(`http://localhost:3000/sql`, {
        query: req
    }).then(() => {
        setTimeout(() => {window.location.reload(false)}, 1250)
    })
}

