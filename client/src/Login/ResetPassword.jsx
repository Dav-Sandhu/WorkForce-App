import "./ResetPassword.scss"

import { useState } from "react"

const ResetPassword = ({dispatch, reset_password}) => {

    //to handle the state of the email that the password reset will be sent to.
    const [email, setEmail] = useState("")

    return(
        <>
            {reset_password ? 
            <div className="card text-center reset-password">
                
                {/*to close the password reset box*/}
                <button type="button" className="close-button btn-close" onClick={() => 
                    dispatch({
                        type: "reset_password",
                        payload: ""
                    })
                }></button>
                <div className="card-header h5 text-white bg-primary">Password Reset</div>
                <div className="card-body px-5">
                    <p className="card-text py-2">
                        Enter your email address and we'll send you an email with instructions to reset your password.
                    </p>

                    {/*for entering the email of the employee that needs their password reset*/}
                    <div className="form-outline">
                        <input 
                            type="email" 
                            id="typeEmail" 
                            className="form-control my-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <label className="form-label" htmlFor="typeEmail">Email input</label>
                    </div>

                    {/*
                    For submitting the form and checking if the email exists in the database 
                    if it does, an email will be sent with further instructions.
                    */}
                    <a 
                        className="btn btn-primary w-100"
                        onClick={() => {
                            const request = async () => {
                                const module = await import('../useDB')
                                const makeRequest = module.makeRequest

                                alert("Your password will be sent to your email if it is registered.")

                                //turns off password reset box
                                dispatch({
                                    type: "reset_password",
                                    payload: ""
                                })

                                //sends an email to the given employee (first checks to see if they are registered.)
                                await makeRequest({
                                    sendInfo: "Reset",
                                    subject: "Password Reset",
                                    email: email,
                                    name: "Password Reset"

                                }, '/sendemail', null)
                            }   

                            request()
                        }}>Reset password</a>
                    <div className="d-flex justify-content-between mt-4">
                        <a className="" href="/login">Login</a>
                        <a className="" href="/register">Register</a>
                    </div>
                </div>
            </div> : ""
            }
        </>
    )
}

export default ResetPassword