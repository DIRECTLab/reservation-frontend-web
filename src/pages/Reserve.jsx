import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import '../index.css'
import { AiOutlineSearch } from "react-icons/ai"
import L from 'leaflet'
import api from '../api';

const Reserve = ({token, menuOpen, setMenuOpen}) => {

  const [center, setCenter] = useState([41.759815029001956, -111.81735767016022])
  const [loading, setLoading] = useState(true)
  const [charger, setCharger] = useState("")
  const [chargerInformation, setChargerInformation] = useState([])

  const chargerIcon = L.icon({
    iconUrl: 'chargerIcon.png',
    iconSize: [30, 30]
  })

  const getChargers = async () => {
    const chargersRes = await api.getChargers()
		if (chargersRes.error) {
			return alert(chargersRes.error)
		}
		let chargerInformation = chargersRes.data.rows.map(data => {
			if (data.name !== null && data.latitude !== null && data.longitude !== null) {
				let dataObject = {
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

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }


  useEffect(() => {
    setLoading(true)
    getChargers()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
      <h1 className="text-2xl font-bold mt-4">Reserve</h1>
      <h2 className='text-md mt-4'>Select the charger you want to reserve</h2>
      <div id="map-container" className={`flex content-center items-center w-4/5 mt-4 ${menuOpen ? '-z-10' : 'z-10'}`} >
        <MapContainer center={center} zoom={15}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
              contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { chargerInformation.map((charger, idx) => (
          <Marker position={[charger.latitude, charger.longitude]} icon={chargerIcon} key={idx}>
            <Popup>
              Charger name: {charger.name}<br />
            </Popup>
          </Marker>
        )
        )}
        </MapContainer>
      </div>
      <h2 className='text-md mt-12'>Search for it manually</h2>
      <div className='relative w-4/5 flex justify-center'>
        <div>
          <AiOutlineSearch className='absolute mt-6 ml-2 text-gray-500'/>
          <input 
            type="text" 
            placeholder="Charger Name" 
            className="input input-bordered w-full max-w-xs mt-2 placeholder: pl-8 placeholder: text-gray-500" 
            value={charger}
            onChange={(event) => setCharger(event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
export default Reserve;