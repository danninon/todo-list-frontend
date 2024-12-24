import './Nav.css';

const Nav = () => {


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <h2 className="navbar-title">Todo List</h2>
            <button onClick={handleLogout} className="logoutBtn">
                Logout
            </button>
        </nav>
    );
};

export default Nav;
