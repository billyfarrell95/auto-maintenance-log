import auth from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home</h1>
            {!auth.currentUser && (
                <button onClick={() => {navigate("/login")}}>Log in</button>
            )}
        </div>
    )
}

export default Home;