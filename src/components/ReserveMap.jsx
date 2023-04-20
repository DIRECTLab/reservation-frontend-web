import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import '../index.css'
import { useState } from "react";

const ReserveMap = ({menuOpen, chargerInformation, selectCharger}) => {
  const [center, setCenter] = useState([41.759815029001956, -111.81735767016022])

  const chargerIcon = L.icon({
    iconUrl: 'chargerIcon.png',
    iconSize: [30, 30]
  })

  return (
    <div id="map-container" className={`flex content-center items-center w-4/5 mt-4 ${menuOpen ? '-z-10' : 'z-10'}`} >
      <MapContainer center={center} zoom={15}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
            contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {chargerInformation.map((charger, idx) => (
          <Marker
            position={[charger.latitude, charger.longitude]}
            icon={chargerIcon}
            key={idx}
            eventHandlers={{
              click: (e) => {
                selectCharger(charger)
                document.getElementById('my-modal-6').checked = true;

              }
            }}
          >
          </Marker>
        )
        )}
      </MapContainer>
    </div>
  )
}
export default ReserveMap