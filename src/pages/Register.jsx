import { useEffect, useState } from "react";
import api from "../api";
import Alert from "../components/Alert";

const Register = ({setToken}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [alert, setAlert] = useState(false)
  const [error, setError] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    setTimeout(() => {
      setError(false)
      setAlertMessage("")
      setAlert(false)
    }, 5000)
  }, [alert])


  const createUser = async () => {
    if (username === "") {
      setError(true)
      setAlertMessage("Please fill out your username")
      setAlert(true)
      return
    }
    if (password === "") {
      setAlert(true)
      setError(true)
      setAlertMessage("Please fill out your password")
      return
    }
    if (confirmPassword === "") {
      setAlert(true)
      setError(true)
      setAlertMessage("Please confirm the password")
      return
    }
    if (firstName === "") {
      setAlert(true)
      setError(true)
      setAlertMessage("Please fill out your first name")
      return
    }
    if (lastName === "") {
      setAlert(true)
      setError(true)
      setAlertMessage("Please fill out your last name")
      return
    }
    if (password !== confirmPassword) {
      setAlert(true)
      setError(true)
      setAlertMessage("Passwords do not match")
      return
    }
    const res = await api.createUser({
      'username': username,
      'password': password,
      'firstName': firstName,
      'lastName': lastName
    })
    if (res.error) {
      setAlert(true)
      setError(true)
      setAlertMessage(res.error)
      return
    }
    else {
      setAlert(true)
      setError(false)
      setAlertMessage("Successfully Created User")
      const loginRes = await api.login({
        'username': username,
        'password': password,
      })
      if (loginRes.error) {
        setAlert(true)
        setError(true)
        setAlertMessage(loginRes.error)
        return
      }
      else {
        window.location.pathname = "/"
        setToken(loginRes.data.token)
      }
    }

  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      {alert &&
        <Alert error={error} message={alertMessage}/>
      }
      <h1 className="text-2xl mt-4 font-bold">Register</h1>
      <div className="form-control w-4/5 max-w-xs mt-2">
        <label className="label">
          <span className="label-text text-xl">Username</span>
        </label>
        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" value={username} onChange={(event) => setUsername(event.target.value)}/>
        <label className="label">
          <span className="label-text text-xl">First Name</span>
        </label>
        <input type="text" placeholder="First Name" className="input input-bordered w-full max-w-xs" value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
        <label className="label">
          <span className="label-text text-xl">Last Name</span>
        </label>
        <input type="text" placeholder="Last Name" className="input input-bordered w-full max-w-xs" value={lastName} onChange={(event) => setLastName(event.target.value)}/>
        <label className="label">
          <span className="label-text text-xl">Password</span>
        </label>
        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" value={password} onChange={(event) => setPassword(event.target.value)}/>
        <label className="label">
          <span className="label-text text-xl">Confirm Password</span>
        </label>
        <input type="password" placeholder="Confirm Password" className="input input-bordered w-full max-w-xs" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
      </div>
      <button 
        className="btn btn-primary text-secondary w-4/5 md:w-1/5 mt-8"
        onClick={() => createUser()}
      >
        Register
      </button>
      <button 
        className="btn btn-primary text-secondary w-4/5 md:w-1/5 my-8"
        onClick={() => window.location.pathname = "/"}
      >
        Already have an account?
      </button>
    </div>
  )
}
export default Register;