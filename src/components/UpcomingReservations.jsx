import { useEffect, useState } from "react";
import api from "../api";

const UpcomingReservations = ({ userId }) => {
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUpcomingReservations = async () => {
    const res = await api.reservation(userId).getUpcoming();

    if (res.error) {
      alert(res.error);
      return;
    }

    setLoading(false);
    setUpcomingReservations(res.data.rows);
  }

  useEffect(() => {
    setLoading(true);
    getUpcomingReservations()
  }, [])

  useEffect(() => {
    console.log(upcomingReservations);
    console.log(upcomingReservations.length);
  }, [upcomingReservations])




  // const upcomingReservations = [1,2] // Replace with actual data

  return (
    <div className="w-4/5 md:w-3/5 bg-base-100 flex justify-center items-center mb-8">
      {loading && <div> </div>}
      {!loading && upcomingReservations.length !== 0 && 
        <>
          {upcomingReservations.map(reservation => (
            <div className="card w-4/5 md:w-3/5 bg-base-100 shadow-xl flex justify-center items-center mb-8" key={reservation}>
              <div className="card-body">
                <h2 className="card-title justify-center">EVR East Charger</h2>
                <h2 className="text-lg self-center">Car Model: Tesla</h2>
                <h2 className="text-lg self-center">8:00 AM - 10:00 AM</h2>
                <div className="card-actions justify-center mt-8">
                  <button className="btn btn-error text-secondary">Cancel Reservation</button>
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