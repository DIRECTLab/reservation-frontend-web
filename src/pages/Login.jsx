import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  let navigate = useNavigate()
  const routeChange = (path) => {
    navigate(path)
  }

  const login = async () => {
    if (username === "") {
      alert("Please enter username")
      return
    }
    if (password === "") {
      alert("Please enter a password")
      return
    }

    const res = await api.login({
      'username': username,
      'password': password,
    })
    if (res.error) {
      alert(res.error)
      return
    }
    else {
      routeChange("/")
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center">
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
    </div>
  )
}
export default Login;