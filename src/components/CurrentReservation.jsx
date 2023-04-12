import { useEffect, useState } from "react";
import api from "../api";

const CurrentReservation = ({userId}) => {
  const [currentReservation, setCurrentReservation] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrent = async () => {
    const res =  await api.reservation(userId).getCurrent();
    if (res.error) {
      alert(res.error)
      return
    }
    console.log(res.data.rows[0])
    setLoading(false)
    setCurrentReservation(res.data.rows[0])
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


  if (!currentReservation) {
    return (
      <div>No Current Reservation</div>
    )
  }
  return (
    <div className="card w-4/5 md:w-3/5 bg-base-100 shadow-xl flex justify-center items-center -z-10">
      <div className="card-body">
        <h2 className="card-title justify-center">{currentReservation.Charger.name}</h2>
        {/* <h2 className="text-lg self-center">Car Model: Tesla</h2> */}
        <h2 className="text-lg self-center">{formatDate(currentReservation.datetime)}</h2>
        <h2 className="text-lg self-center">{formatTime(currentReservation.datetime)}</h2>

        <div className="card-actions justify-center mt-8">
          <button className="btn btn-error text-secondary">Cancel Reservation</button>
        </div>
      </div>
    </div>
  )
}
export default CurrentReservation;