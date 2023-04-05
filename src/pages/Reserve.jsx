import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import '../index.css'
import { AiOutlineSearch } from "react-icons/ai"

const Reserve = () => {

  const [center, setCenter] = useState([41.759815029001956, -111.81735767016022])
  const [loading, setLoading] = useState(true)
  const [charger, setCharger] = useState("")

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mt-4">Reserve</h1>
      <h2 className='text-md mt-4'>Select the charger you want to reserve</h2>
      <div id="map-container" className="flex content-center items-center w-4/5 mt-4 -z-10">
        <MapContainer center={center} zoom={15}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
            contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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