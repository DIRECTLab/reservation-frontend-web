import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import '../index.css'
import { AiOutlineSearch } from "react-icons/ai"
import L from 'leaflet'
import api from '../api';
import Datepicker from "react-tailwindcss-datepicker";
import Alert from '../components/Alert';

const Reserve = ({token, menuOpen, setMenuOpen, encodedToken}) => {
  const [center, setCenter] = useState([41.759815029001956, -111.81735767016022])
  const [loading, setLoading] = useState(true)
  const [charger, setCharger] = useState("")
  const [chargerInformation, setChargerInformation] = useState([])
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: null });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours()+1);

  const [error, setError] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")


  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectableHours, setSelectableHours] = useState([]);

  const chargerIcon = L.icon({
    iconUrl: 'chargerIcon.png',
    iconSize: [30, 30]
  })

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

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }
      

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)


  const handleValueChange = (newDate) => {
    setSelectedDate(newDate);
  }

  const formatHour = (time) => {
    if (time > 12) {
      return `${time - 12} PM`
    } else if (time === 12) {
      return `${time} PM`
    } else if (time === 0) {
      return `${time + 12} AM`
    } else {
      return `${time} AM`
    }
  }



  useEffect(() => {
    setLoading(true)
    getChargers()
  }, [])

  const reserveTime = async () => {
    
    let day = new Date(selectedDate.startDate)
    day.setDate(day.getDate())
    day.setHours(selectedHour, 0, 0, 0, 0);

    
    const res = await api.reservation(token.id).reserve({
      'datetime': day,
      'ChargerId': charger.id,
      'UserId': token.id,
    }, encodedToken);
		if (res.error) {
      setError(true)
      setAlertMessage(res.error)
      setAlert(true)
      return
		}
    else {
      setError(false)
      setAlertMessage("Reservation Made")
      setAlert(true)
    }
  }

  
  useEffect(() => {
    let date = `${new Date().toLocaleDateString('en-ca')}`
    let availableHours = [];

    if (selectedDate.startDate === date) {
      for (let i = currentHour + 1; i < 24; i++) {
        availableHours.push(i);
      }
    } else {
      for (let i = 0; i < 24; i++) {
        availableHours.push(i);
      }
    }
    
    setSelectableHours(availableHours);
    
  }, [selectedDate])
  
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
      <div id="map-container" className={`flex content-center items-center w-4/5 mt-4 ${menuOpen ? '-z-10' : 'z-10'}`} >
        <MapContainer center={center} zoom={15}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
              contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { chargerInformation.map((charger, idx) => (
          <Marker 
            position={[charger.latitude, charger.longitude]}
            icon={chargerIcon}
            key={idx}
            eventHandlers={{
              click: (e) => {
                setCharger(charger)
                document.getElementById('my-modal-6').checked = true;

              }
            }}
          >
          </Marker>
        )
        )}
        </MapContainer>
      </div>
      <h2 className='text-md mt-4'>Search for it manually</h2>
      <div className='relative w-4/5 flex justify-center'>
        <div>
          <AiOutlineSearch className='absolute mt-6 ml-2 text-gray-500' />
          <input
            type="text"
            placeholder="Charger Name"
            className="input input-bordered w-full max-w-xs mt-2 placeholder: pl-8 placeholder: text-gray-500"
            value={charger}
            onChange={(event) => setCharger(event.target.value)}
          />
        </div>
      </div>


      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom md:modal-middle ">
        <div className="modal-box w-11/12 h-4/5">
          <label htmlFor="my-modal-6" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

          <h3 className="font-bold text-lg">Reservation</h3>
          <p className="py-4">You selected: <strong>{charger.name}</strong></p>
          <h4>Choose a date for your reservation:</h4>
          <div className='mt-4'>
            <Datepicker
              primaryColor='blue'
              minDate={yesterday}
              useRange={false}
              asSingle={true}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          
          
          <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 mt-4 ${!isVisible ? "visible" : "hidden"}`}>
            <button className="btn btn-primary text-secondary w-full" onClick={() => {setIsVisible(true)}}>
              Reservation Time: {formatHour(selectedHour)}
            </button>
            <div className={`modal-action ${(selectableHours !== null && selectedDate !== null) ? '' : 'invisible'}`}>
              <label htmlFor="my-modal-6" className="btn" onClick={() => {reserveTime()}}>Reserve</label>
            </div>
          </div>

          <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 ${isVisible ? "visible" : "hidden"}`}>
            {selectableHours.map(time => (
              <button className="btn btn-primary text-secondary w-full mt-4" key={time} onClick={() => {setSelectedHour(time); setIsVisible(false)}}>{formatHour(time)}</button>
            ))}
          </div>


        </div>

      </div>

    </div>
  )
}
export default Reserve;