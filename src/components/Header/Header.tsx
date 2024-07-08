import { useNavigate } from "react-router-dom";
import auth from "../../firebase/firebase";
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    const signOut = () => {
        auth.signOut();
    }

    return (
        <header className="main-header">
            
            {auth.currentUser ? (
                <>
                    <h1><a href="/app">Auto Maintenance Log</a></h1>
                    <div className="main-header__buttons">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/settings")} aria-label="Settings"><i className="bi bi-gear"></i></button>
                        <button className="btn btn-primary btn-sm" onClick={signOut}>Sign out</button>
                    </div>
                </>
            ) : (
                <h1><a href="/login">Auto Maintenance Log</a></h1>
            )}
        </header>
    )
}

export default Header;