import { useEffect, useState } from "react";
import api from "../api";

const CurrentReservation = ({userId}) => {
  const [currentReservation, setCurrentReservation] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUpcoming = async () => {
    const res =  await api.reservation(userId).getCurrent();
    if (res.error) {
      alert(res.error)
      return
    }
    setLoading(false)
    setCurrentReservation(res)
  }


  useEffect(() => {
    setLoading(true)
    getUpcoming()
    
  }, [])

  useEffect(() => {
    console.log("Upcoming!" + currentReservation);
  }, [currentReservation])


  return (
    <div className="card w-4/5 md:w-3/5 bg-base-100 shadow-xl flex justify-center items-center -z-10">
      <div className="card-body">
        <h2 className="card-title justify-center">EVR East Charger</h2>
        <h2 className="text-lg self-center">Car Model: Tesla</h2>
        <h2 className="text-lg self-center">8:00 AM - 10:00 AM</h2>
        <div className="card-actions justify-center mt-8">
          <button className="btn btn-error text-secondary">Cancel Reservation</button>
        </div>
      </div>
    </div>
  )
}
export default CurrentReservation;