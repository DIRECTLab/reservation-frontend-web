import { useEffect, useState } from "react";
import CurrentReservation from "../components/CurrentReservation";
import UpcomingReservations from "../components/UpcomingReservations";
import Alert from "../components/Alert";

const Home = ({token, menuOpen, setMenuOpen, encodedToken}) => {
  const [alert, setAlert] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
      setError(false)
    }, 5000)
  }, [alert])

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
        {alert &&
            <Alert error={error} />
        }
        <h1 className="text-2xl mt-4 font-bold">Welcome {token.firstName}</h1>
        <h2 className="text-xl mt-4 font-semibold">Current Reservation</h2>
        <CurrentReservation userId={token.id} encodedToken={encodedToken} menuOpen={menuOpen} setError={setError} setAlert={setAlert}/>
        <div className="divider"/>
        <h2 className="text-xl mt-4 font-semibold">Upcoming Reservations</h2>
        <UpcomingReservations userId={token.id} encodedToken={encodedToken} setError={setError} setAlert={setAlert}/>
      </div>
    </>
  )

}
export default Home;