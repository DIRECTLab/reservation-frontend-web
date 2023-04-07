import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")


  let navigate = useNavigate()
  const routeChange = (path) => {
    navigate(path)
  }

  const createUser = async () => {
    if (username === "") {
      alert("Please fill out your username")
      return
    }
    if (password === "") {
      alert("Please fill out your password")
      return
    }
    if (confirmPassword === "") {
      alert("Please confirm the password")
      return
    }
    if (firstName === "") {
      alert("Please fill out your first name")
      return
    }
    if (lastName === "") {
      alert("Please fill out your last name")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    const res = await api.createUser({
      'username': username,
      'password': password,
      'firstName': firstName,
      'lastName': lastName
    })
    if (res.error) {
      alert(res.error)
      return
    }
    else {
      alert("Successfully Created User")
      const loginRes = await api.login({
        'username': username,
        'password': password,
      })
      if (loginRes.error) {
        alert(loginRes.error)
        return
      }
      else {
        routeChange("/")
      }
    }

  }
  
  return (
    <div className="flex flex-col items-center justify-center">
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
        className="btn btn-primary text-secondary w-4/5 md:w-1/5 my-8"
        onClick={() => createUser()}
      >
        Register
      </button>
    </div>
  )
}
export default Register;