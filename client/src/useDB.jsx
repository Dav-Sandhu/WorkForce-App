import axios from "axios"

//all front-end interactions with the back-end and database will be filtered through here
export const makeRequest = async (req, url, token) => {
    
    //if there is a problem it will return a failure state (status flag set to -1)
    try{
        //the two options are for jwt authenticated interactions with db vs non authenticated interactions
        const res = token ? await axios.get(url, {
            headers: {
                authorization: token
            },
            params: {
                query: req
            }
        }) : await axios.post(url, { data: req })

        return res.data
    }catch(e){
        return { status: -1 }
    }
}