const Nav = () => {
    // const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token from localStorage
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <h2>Todo List</h2>
            <button onClick={handleLogout} className="logoutBtn">
                Logout
            </button>
        </nav>
    );
};

export default Nav;
