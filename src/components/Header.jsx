import { useUser } from "../context/UserContext";

function Header() {
    const {user, setUser} = useUser(); // reads the shared data using useUser
    function changeUser() {
        setUser({
            ...user, // preserves the other properties, such as the role, while name: "Priya" updates the name.
            name: "Priya"
        })
    }
    return (
        <header>
            <h2>Glow Salon</h2>
            <p>Welcome, {user.name}</p>
            <p>Role: {user.role}</p>
            <button onClick={changeUser}>Change User</button>
        </header>
    )
}

export default Header;