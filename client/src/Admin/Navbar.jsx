import "./Navbar.scss"
import { useUserInfo } from "../UserProvider" 
import { useNavigate } from "react-router-dom"

const Navbar = ({ children }) => {
   
    const navigate = useNavigate()
    const user = useUserInfo()
   
    return(
        <>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid"><span className="navbar-brand">SFM WORKFORCE</span></div>
            </nav>
            <div className="container-fluid">
                <div className="row flex-nowrap grid-container">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-purple">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                {
                                    user.userInfo.is_supervisor ? 
                                    <li className="nav-item navHeading">
                                        <a className="nav-link align-middle px-0" href="/">
                                            <span className="ms-1 d-none d-sm-inline navBtn">Home</span>
                                        </a>
                                    </li> : ""
                                }
                                <li className="nav-item active navHeading">
                                    <a className="nav-link align-middle px-0" href="/admin">
                                        <span className="ms-1 d-none d-sm-inline navBtn">Reports</span>
                                    </a>
                                </li>
                                <li className="nav-item navHeading">
                                    <a className="nav-link align-middle px-0" href="/employees">
                                        <span className="ms-1 d-none d-sm-inline navBtn">Employees</span>
                                    </a>
                                </li>
                                <li className="nav-item navHeading">
                                    <a className="nav-link align-middle px-0"  href="/customers">
                                        <span className="ms-1 d-none d-sm-inline navBtn">Customers</span>
                                    </a>
                                </li>
                                <li className="nav-item navHeading">
                                    <a className="nav-link align-middle px-0" href="/processes">
                                        <span className="ms-1 d-none d-sm-inline navBtn">Processes</span>
                                    </a>
                                </li>
                                <li className="nav-item navHeading">
                                    <a className="nav-link align-middle px-0" href="/assign">
                                        <span className="ms-1 d-none d-sm-inline navBtn">Jobs</span>
                                    </a>
                                </li>
                                <li className="nav-item navHeading">
                                    <a className="nav-link align-middle px-0" onClick={() => {
                                        sessionStorage.removeItem("token")
                                    }} href='/login'>
                                        <span className="ms-1 d-none d-sm-inline navBtn">Log Out</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col content-section min-vh-100">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar