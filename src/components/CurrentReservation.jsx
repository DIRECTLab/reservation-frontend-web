import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CurrentReservation = ({userId, menuOpen, setError, setAlert, setAlertMessage}) => {
  const [currentReservation, setCurrentReservation] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrent = async () => {
    const res =  await api.reservation(userId).getCurrent();
    if (res.error) {
      setError(true)
      setAlertMessage(res.error)
      setAlert(true)
      return
    }
    setLoading(false)
    setCurrentReservation(res.data[0])
  }


  useEffect(() => {
    setLoading(true)
    getCurrent()
    
  }, [])

  const formatTime = (date) => {
    let tempDate = new Date(date);

    return tempDate.toLocaleTimeString();
  }

  const formatDate = ((date) => {
    return `${new Date(date).toLocaleDateString('en-us')}`
  })


  let navigate = useNavigate()
  const routeChange = (path) => {
    navigate(path)
  }


  if (!currentReservation) {
    return (
      <div className={`card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center ${menuOpen ? '-z-10' : ''}`}>
        <div className="card-body">
          <h2 className="card-title justify-center text-center">No Current Reservation</h2>
          <div className="card-actions justify-center mt-8">
            <button 
              className="btn btn-primary text-secondary"
              onClick={() => {routeChange("/reserve"); }}
            >
              Make a Reservation
            </button>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="card w-4/5 md:w-2/5 bg-base-100 shadow-xl flex justify-center items-center -z-10">
        <div className="card-body">
          <h2 className="card-title justify-center">{currentReservation.Charger.name}</h2>
          {/* <h2 className="text-lg self-center">Car Model: Tesla</h2> */}
          <h2 className="text-lg self-center">{formatDate(currentReservation.datetime)}</h2>
          <h2 className="text-lg self-center">Starts at: {formatTime(currentReservation.datetime)}</h2>  
        </div>
      </div>
    )
  }
}
export default CurrentReservation;