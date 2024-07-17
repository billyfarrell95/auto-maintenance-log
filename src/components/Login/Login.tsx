import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import auth from '../../firebase/firebase';
import "./Login.css";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            navigate('/app');
          }
        });
    
        return () => unsubscribe();
      }, [])
    
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

        ui.start('#firebaseui-auth-container', {
            callbacks: {
                signInSuccessWithAuthResult: () => {
                    return true;
                },
                uiShown: function() {
                    // This is what should happen when the form is full loaded. In this example, I hide the loader element.
                    document.getElementById('loader')!.style.display = 'none';
                }
            },
            signInFlow: 'popup',
            signInSuccessUrl: '/app', // This is where should redirect if the sign in is successful.
            signInOptions: [ // This array contains all the ways an user can authenticate in your application.
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    requireDisplayName: false,
                }
            ],
            // Terms of service url.
            tosUrl: '/terms',
            // Privacy policy url.
            privacyPolicyUrl: '/privacy'
        });
    }, []);
    return (
        <>
            <main className="main-wrapper">
                <div className="login">
                    <h1>Login</h1>
                    <div id="firebaseui-auth-container"></div>
                    <div id="loader">Loading...</div>
                </div>
            </main>
        </>
    )
}

export default Login;