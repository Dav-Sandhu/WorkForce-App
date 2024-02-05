const Navbar = () => {
    return(
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <a className="navbar-brand ms-2">Admin</a>

            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navContent" 
                aria-controls="navContent" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/admin">Daily Reports</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/update">Update Information</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/assign">Assign Jobs</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={() => {
                            sessionStorage.removeItem("token")
                        }} href='/login'>Log Out</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar