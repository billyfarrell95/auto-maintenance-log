import auth from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <main className="main-wrapper">
            <h1>Home</h1>
            {!auth.currentUser && (
                <button className="btn btn-primary" onClick={() => {navigate("/login")}}>Log in</button>
            )}
        </main>
    )
}

export default Home;