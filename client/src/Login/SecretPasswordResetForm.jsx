import { useState } from "react"

const SecretPasswordResetForm = ({email, navigate}) => {

    const [password, setPassword] = useState("")
    const [reenterPassword, setReenterPassword] = useState("")

    return(
        <form onSubmit={(e) => {
            e.preventDefault()
            
            if (password === reenterPassword){

                const request = async () => {
                    const module = await import('../useDB')
                    const makeRequest = module.makeRequest
                    
                    const res = await makeRequest({ email, password }, '/update-password', null)
                    const status = res.status

                    if (res.status === 1){
                        alert("Password Updated!")
                        navigate("/login")
                    }else{
                        alert("Failed to update password, please try again!")
                    }
                }

                request()
            }else{alert("Passwords don't match!")}
        }}>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}} />
            </div>

            <div class="form-group">
                <label htmlFor="reenter-password">Password</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="reenter-password" 
                    placeholder="Password"
                    value={reenterPassword}
                    onChange={(e) => {setReenterPassword(e.target.value)}} />
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default SecretPasswordResetForm