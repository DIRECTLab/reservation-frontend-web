import { useEffect, useState } from "react";
import api from "../api";
import Alert from "../components/Alert";


const Login = ({setToken}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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

  const login = async () => {
    if (username === "") {
      setError(true)
      setAlertMessage("Please enter username")
      setAlert(true)
      return
    }
    if (password === "") {
      setError(true)
      setAlertMessage("Please enter a password")
      setAlert(true)
      return
    }

    const res = await api.login({
      'username': username,
      'password': password,
    })
    if (res.error) {
      setError(true)
      setAlertMessage(res.error)
      setAlert(true)
      return
    }
    else {
      setToken(res.data.token)
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {alert &&
        <Alert error={error} message={alertMessage} />
      }
      <h1 className="text-2xl mt-4 font-bold">Login</h1>
      <div className="form-control w-4/5 max-w-xs mt-16">
        <label className="label">
          <span className="label-text text-xl">Username</span>
        </label>
        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" value={username} onChange={(event) => setUsername(event.target.value)}/>
        <label className="label">
          <span className="label-text text-xl">Password</span>
        </label>
        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" value={password} onChange={(event) => setPassword(event.target.value)}/>
      </div>
      <button 
        className="btn btn-primary text-secondary w-4/5 md:w-1/5 mt-8"
        onClick={() => login()}
      >
        Login
      </button>
      <button 
        className="btn btn-primary text-secondary w-4/5 md:w-1/5 mt-8"
        onClick={() => window.location.pathname = "/register"}
      >
        Don't have an account?
      </button>
    </div>
  )
}
export default Login;