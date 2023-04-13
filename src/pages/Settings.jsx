import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

const Settings = ({token, setToken, menuOpen, setMenuOpen}) => {
  const [alert, setAlert] = useState(false)
  const [error, setError] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
      setError(false)
      setAlertMessage("")
    }, 5000)
  }, [alert])

  let navigate = useNavigate()
  const routeChange = (path) => {
    navigate(path)
  }
  const logout = () => {
    setToken(null)
    return routeChange("/")
  }

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
      {alert &&
        <Alert error={error} message={alertMessage}/>
      }
      <h2 className="text-2xl font-bold mt-4">Settings</h2>
      <div className="fixed bottom-8 w-3/4 md:w-2/5 lg:w-1/5">
        <button 
          className="btn btn-error text-secondary w-full"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
export default Settings;