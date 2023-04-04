import React from "react";
import {
  Link
} from "react-router-dom";
const NavigationBar = () => {
  return (
    <>
      <div className="navbar bg-base-100 mb-2 w-full">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <nav className="w-full">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">Home</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
                <li><Link to="/reserve">Reserve</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

export default NavigationBar;