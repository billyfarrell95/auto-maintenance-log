import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './components/Login/Login.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home.tsx'
import SettingsPage from './components/SettingsPage/SettingsPage.tsx'
import Terms from './components/Terms/Terms.tsx'
import Privacy from './components/Privacy/Privacy.tsx'
import DemoApp from './components/DemoApp/DemoApp.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, 
  {
    path: "app",
    element: <App />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "settings",
    element: <SettingsPage />
  },
  {
    path: "terms",
    element: <Terms />
  },
  {
    path: "privacy",
    element: <Privacy />
  },
  {
    path: "demo",
    element: <DemoApp />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,

  // <RouterProvider router={router} />
)
