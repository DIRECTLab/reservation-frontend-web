import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import api from "../api";

const ReserveModal = ({token, encodedToken, charger, setError, setAlertMessage, setAlert}) => {
  const [dateSet, setDateSet] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: null });
  const [selectedHour, setSelectedHour] = useState(new Date().getHours() + 1);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectableHours, setSelectableHours] = useState([]);


  useEffect(() => {
    setDateSet(false);
  }, [])

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)

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



  const reserveTime = async () => {

    let day = new Date(selectedDate.startDate)
    day.setDate(day.getDate() + 1)
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
      getReservationsOnCharger(charger.id, selectedDate.startDate);
    }
  }

  const getReservationsOnCharger = async (chargerId, date) => {
    let todayDate = `${new Date().toLocaleDateString('en-ca')}`
    let availableHours = [];

    if (chargerId !== "" && chargerId !== undefined && date != null && date !== undefined) {
      let reservations = await api.getChargerReservations(chargerId, date).getAll();
      if (!reservations.error) {
        let takenReservations = [];

        for (let i = 0; i < reservations.data?.count ?? 0; i++) {

          let tempDate = new Date(reservations.data.rows[i].datetime);
          takenReservations.push(tempDate.getHours())
        }


        if (selectedDate.startDate === todayDate) {
          for (let i = currentHour + 1; i < 24; i++) {
            if (!takenReservations.includes(i)) {
              availableHours.push(i);
            }
          }
        } else {
          for (let i = 0; i < 24; i++) {
            if (!takenReservations.includes(i)) {
              availableHours.push(i);
            }
          }
        }
        setSelectableHours(availableHours);
        setSelectedHour(availableHours[0]);

      }



    } else {
      if (selectedDate.startDate === todayDate) {
        for (let i = currentHour + 1; i < 24; i++) {
          availableHours.push(i);
        }
      } else {
        for (let i = 0; i < 24; i++) {
          availableHours.push(i);
        }
      }

      setSelectableHours(availableHours);
      setSelectedHour(availableHours[0]);
    }
  }

  useEffect(() => {
    getReservationsOnCharger(charger.id, selectedDate.startDate);

  }, [selectedDate, charger])



  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom md:modal-middle ">
        <div className="modal-box w-11/12 h-4/5">
          <label htmlFor="my-modal-6" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

          <h3 className="font-bold text-lg">Reservation</h3>
          <p className="py-4">You selected: <strong>{charger?.name}</strong></p>
          <h4>Choose a date for your reservation:</h4>
          <div className='mt-4'>
            <Datepicker
              primaryColor='green'
              minDate={yesterday}
              useRange={false}
              asSingle={true}
              value={selectedDate}
              readOnly={true}
              onChange={(newDate) => { setSelectedDate(newDate); setDateSet(true); }}
              inputClassName="w-full rounded-md focus:ring-0 font-normal text-gray-500 dark:bg-white dark:text-gray-500"
              classNames="dark:bg-white bg-white"
            />
          </div>

          {dateSet ?
            <div>
              <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 mt-4 ${!isVisible ? "visible" : "hidden"}`}>
                <button className="btn btn-primary text-secondary w-full" onClick={() => { setIsVisible(true) }}>
                  Reservation Time: {formatHour(selectedHour)}
                </button>
                <div className={`modal-action ${(selectableHours !== null && selectedDate !== null) ? '' : 'invisible'}`}>
                  <label htmlFor="my-modal-6" className="btn" onClick={() => { reserveTime() }}>Reserve</label>
                </div>
              </div>

              <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 ${isVisible ? "visible" : "hidden"}`}>
                {selectableHours.map(time => (
                  <button className="btn btn-primary text-secondary w-full mt-4" key={time} onClick={() => { setSelectedHour(time); setIsVisible(false) }}>{formatHour(time)}</button>
                ))}
              </div>
            </div>
            :
            <></>
          }

        </div>

      </div>
    </>
  )
}

export default ReserveModal