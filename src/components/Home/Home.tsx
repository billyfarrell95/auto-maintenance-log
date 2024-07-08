import auth from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <Header />
            <main className="main-wrapper">
            </main>
        </>
    )
}

export default Home;