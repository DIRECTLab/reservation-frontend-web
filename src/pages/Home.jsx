import CurrentReservation from "../components/CurrentReservation";
import UpcomingReservations from "../components/UpcomingReservations";

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl mt-4 font-bold">Welcome</h1>
        <h2 className="text-xl mt-4 font-semibold">Current Reservation</h2>
        <CurrentReservation />
        <div className="divider"/>
        <h2 className="text-xl mt-4">Upcoming Reservations</h2>
        <UpcomingReservations />
      </div>
    </>
  )

}
export default Home;