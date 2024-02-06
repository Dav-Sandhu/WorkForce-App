import axios from "axios"

//all front-end interactions with the back-end and database will be filtered through here
export const makeRequest = async (req, url, token, type) => {
    
    //if there is a problem it will return a failure state (status flag set to -1)
    try{
        let res = null

        if(token && type === "get"){
            //for authenticated get requests
            res = await axios.get(url, { headers: { authorization: token }, params: { query: req }})
        }else if (token && type === "post"){
            //for authenticated post requests
            res = await axios.post(url, { data: req }, { headers: { authorization: token }})
        }else{
            //for unauthenticated get requests
            res = await axios.post(url, { data: req })
        }
            
        return res.data
    }catch(e){
        return { status: -1 }
    }
}