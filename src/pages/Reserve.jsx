// import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import '../index.css'
import { AiOutlineSearch } from "react-icons/ai"
// import L from 'leaflet'
import api from '../api';
import Datepicker from "react-tailwindcss-datepicker";
import Alert from '../components/Alert';
import ReserveMap from "../components/ReserveMap";
import FavoriteChargers from "../components/FavoriteChargers";
import ChargerSearch from "../components/ChargerSearch";
import ReserveModal from "../components/ReserveModal";

const Reserve = ({ token, menuOpen, setMenuOpen, encodedToken }) => {
  const [loading, setLoading] = useState(true)
  const [charger, setCharger] = useState("")
  const [chargerInformation, setChargerInformation] = useState([])

  const [error, setError] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const getChargers = async () => {
    const chargersRes = await api.getChargers()
    if (chargersRes.error) {
      setError(true)
      setAlert(true)
      return
    }
    let chargerInformation = chargersRes.data.rows.map(data => {
      if (data.name !== null && data.latitude !== null && data.longitude !== null) {
        let dataObject = {
          "id": data.id,
          "name": data.name,
          "latitude": data.latitude,
          "longitude": data.longitude
        }
        return dataObject
      }
    })
    chargerInformation = chargerInformation.filter((element) => {
      return element !== undefined;
    });
    setChargerInformation(chargerInformation)
  }

  useEffect(() => {
    setLoading(true)
    getChargers()
  }, [])






  const selectCharger = (charger) => {
    setCharger(charger)
  }


  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
      setError(false)
      setAlertMessage("")
    }, 5000)
  }, [alert])

  return (
    <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
      {alert &&
        <Alert error={error} message={alertMessage} />
      }
      <h1 className="text-2xl font-bold mt-4">Reserve</h1>
      <h2 className='text-md mt-4'>Select the charger you want to reserve</h2>
      <ReserveMap menuOpen={menuOpen} chargerInformation={chargerInformation} selectCharger={selectCharger}/>

      <h2 className='text-md mt-4'>Search for it manually</h2>
      <div className='relative w-4/5 flex justify-center flex-col'>
        <ChargerSearch chargerInformation={chargerInformation} selectCharger={selectCharger}/>
        <FavoriteChargers token={token} encodedToken={encodedToken}/>
      </div>
      <ReserveModal token={token} encodedToken={encodedToken} charger={charger} setError={setError} setAlertMessage={setAlertMessage} setAlert={setAlert}/>


      

    </div>
  )
}
export default Reserve;