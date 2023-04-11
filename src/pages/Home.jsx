import CurrentReservation from "../components/CurrentReservation";
import UpcomingReservations from "../components/UpcomingReservations";

const Home = ({token, menuOpen, setMenuOpen}) => {

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
        <h1 className="text-2xl mt-4 font-bold">Welcome {token.firstName}</h1>
        <h2 className="text-xl mt-4 font-semibold">Current Reservation</h2>
        <CurrentReservation userId={token.id}/>
        <div className="divider"/>
        <h2 className="text-xl mt-4">Upcoming Reservations</h2>
        <UpcomingReservations userId={token.id}/>
      </div>
    </>
  )

}
export default Home;