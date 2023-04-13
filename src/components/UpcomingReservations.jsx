import { useEffect, useState } from "react";
import api from "../api";

const UpcomingReservations = ({ userId, encodedToken, setAlert, setError, setAlertMessage}) => {
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getUpcomingReservations = async () => {
    const res = await api.reservation(userId).getUpcoming();

    if (res.error) {
      setError(true)
      setAlertMessage(res.error)
      setAlert(true)
      return;
    }

    setUpcomingReservations(res.data.rows);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getUpcomingReservations()
  }, [])


  const deleteReservation = async (id) => {
    const res = await api.reservation(id).delete({}, encodedToken);

    if (res.error) {
      setError(true)
      setAlert(true)
      return;
    }

    setLoading(true);
    getUpcomingReservations();
  }


  const formatTime = (date) => {
    let tempDate = new Date(date);

    return tempDate.toLocaleTimeString();
  }

  const formatDate = ((date) => {
    return `${new Date(date).toLocaleDateString('en-us')}`
  })

  // const upcomingReservations = [1,2] // Replace with actual data

  return (
    <div className="w-full md:w-full bg-base-100 flex flex-col justify-center items-center mb-8">
      {loading && <div> </div>}
      {!loading && upcomingReservations.length !== 0 && 
        <>
          {upcomingReservations.map(reservation => (
            <div className="card w-4/5 md:w-3/5 bg-base-100 shadow-xl flex justify-center items-center mb-8" key={reservation.id}>
              <div className="card-body">
                <h2 className="card-title justify-center">{reservation.Charger.name}</h2>
                {/* <h2 className="text-lg self-center">Car Model: Tesla</h2> */}
                <h2 className="text-lg self-center">{formatDate(reservation.datetime)}</h2>
                <h2 className="text-lg self-center">{formatTime(reservation.datetime)}</h2>
                <div className="card-actions justify-center mt-8">
                  <button className="btn btn-error text-secondary" onClick={() => deleteReservation(reservation.id)}>Cancel Reservation</button>
                </div>
              </div>
            </div>
          ))}
        </>
      }
      {!loading && upcomingReservations.length === 0 &&
        <div className="card w-4/5 md:w-4/5 bg-base-100 shadow-xl flex justify-center items-center mb-8">
          <div className="card-body">
            <h2 className="card-title justify-center text-center">No Scheduled Reservations</h2>     
          </div>
        </div>
      }
    </div>
  )
}
export default UpcomingReservations;
