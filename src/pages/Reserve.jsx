import 'leaflet/dist/leaflet.css';
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import '../index.css'

const Reserve = () => {

  const [center, setCenter] = useState([41.759815029001956, -111.81735767016022])
  const [loading, setLoading] = useState(true)


  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mt-4">Reserve</h1>
      <div id="map-container" className="flex content-center items-center w-3/4 mt-8">
        <MapContainer center={center} zoom={15}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
            contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  )
}
export default Reserve;