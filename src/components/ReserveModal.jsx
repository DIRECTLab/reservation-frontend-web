import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from '@fortawesome/free-solid-svg-icons'

const ReserveModal = ({ token, encodedToken, charger, setError, setAlertMessage, setAlert }) => {

  const lowChargeValue = 30;
  const highChargeValue = 150;
  const [currentKWReserve, setCurrentKWReserve] = useState(((highChargeValue - lowChargeValue) * 0.5) + lowChargeValue);
  const [dateSet, setDateSet] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: null });
  const [selectedHour, setSelectedHour] = useState(new Date().getHours() + 1);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectableHours, setSelectableHours] = useState([]);
  const [optimalChargeRange, setOptimalChargeRange] = useState({});
  const [numberOfChargerTokens, setNumberOfChargerTokens] = useState(0);
  const [costOfReservation, setCostOfReservation] = useState(1);


  useEffect(() => {
    setDateSet(false);
  }, []);

  const loadNumberOfTokens = async () => {
    const res = await api.user(token.id).getUser();
    setNumberOfChargerTokens(res.data.numberOfChargerTokens);
  }

  useEffect(() => {
    loadNumberOfTokens();
  }, []);

  function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
  }
  
  class Color {
    constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    toString() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, 1)`
    }

    toHex() {
      return rgbToHex(this.r * 255.999, this.g * 255.999, this.b * 255.999);
    }
  }

  function blendColors(color1, color2, step) {
    // blends colors with linear interpolation, step should be 0-1
    return new Color(color1.r * (1 - step) + color2.r * step, color1.g * (1 - step) + color2.g * step, color1.b * (1 - step) + color2.b * step);
  }

  class Gradient {
    constructor(colors, steps) {
      // takes in an array of colors and steps where it should be applied
      // where step is the point you want it to 'become' that color. There should always be at least 2 colors, one at the minimum value, one at the max
      this.colors = colors;
      this.steps = steps;
    }

    evaluate(value) {
      let color1, step1;
      let color2, step2;
      for (let i = 0; i < this.colors.length - 1; i++) {
        if (value >= this.steps[i] && value <= this.steps[i + 1]) {
          color1 = this.colors[i];
          step1 = this.steps[i];
          color2 = this.colors[i + 1];
          step2 = this.steps[i + 1];
          break;
        }
      }
      if (!color1) {
        throw new Error("Invalid colors, steps, or value.");
      }

      const step = (value - step1) / (step2 - step1);
      const blendedColor = blendColors(color1, color2, step);
      return blendedColor.toHex();
    }
  }

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

        for (let i = 0; i < reservations.data?.length ?? 0; i++) {

          let tempDate = new Date(reservations.data[i].datetime);
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

  const loadNewRange = async () => {
    const res = await api.charger.getOptimalChargeRange({ params: { id: 1, startTime: `${selectedDate}T${selectedHour ?? '00'}:00:00Z` } }); // This is probably not correct, Check this once backend is implemented fully
    setOptimalChargeRange(res.data.chargeRange);
  }

  const root = document.querySelector(":root");
  const red = new Color(224 / 255, 60 / 255, 50 / 255);
  const blue = new Color(19 / 255, 232 / 255, 161 / 255);
  const green = new Color(123 / 255, 182 / 255, 98 / 255);


  const setSliderColor = (chargeAmount) => {
    const gradient = new Gradient([blue, green, red], [0, (((optimalChargeRange?.low ?? 50 - lowChargeValue) / (highChargeValue - lowChargeValue)) + ((optimalChargeRange?.high ?? 100 - lowChargeValue) / (highChargeValue - lowChargeValue))) * 50, 100]);
    let color = `${gradient.evaluate(chargeAmount)}`;
    root.style.setProperty('--sliderColor', color);

    setCurrentKWReserve(((chargeAmount / 100) * (highChargeValue - lowChargeValue) + lowChargeValue).toFixed(1));
  }

  useEffect(() => {
    loadNewRange();
    setSliderColor(50);
  }, [selectedDate, selectedHour]);


  const handleSliderInput = (event) => {
    setSliderColor(Number.parseFloat(event.target.value));
    if (event.type === "mouseup") {
      console.log("Mouse up")
    }
  }

  const getTokenCost = async (event) => {
    const res = await api.charger.getCost({ params: { id: 1, startTime: `${selectedDate}T${selectedHour ?? '00'}:00:00Z`, chargeAmount: event.target.value } });
    setCostOfReservation(res.data.cost);
  }



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
              inputClassName="w-full rounded-md focus:ring-0 font-normal !text-gray-500 dark:bg-white !dark:text-gray-500"
              classNames="dark:bg-white bg-white"
            />
          </div>

          {dateSet ?
            <div>
              <div className={`overflow-x-auto w-full flex flex-col items-center h-1/2 mt-4 ${!isVisible ? "visible" : "hidden"}`}>
                <button className="btn btn-primary text-secondary w-full" onClick={() => { setIsVisible(true) }}>
                  Reservation Time: {formatHour(selectedHour)}
                </button>

                <div>
                  <h2 className="text-center mt-4 font-semibold">{currentKWReserve}kW</h2>
                </div>
                <div className="range">
                  <input
                    type="range"
                    id="chargeSlider"
                    min={0}
                    max={100}
                    onChange={handleSliderInput}
                    onClick={getTokenCost}
                  />
                </div>

                <div className="w-full flex flex-row">
                  <span className="text-xs flex-auto">Slowest Rate</span>
                  <span className="text-xs flex-auto text-right">Fastest Rate</span>
                </div>

                <div className="w-full mt-4 text-center">
              
                  <h1 className="text-lg font-bold">Costs: <span className="text-error pl-1"><FontAwesomeIcon icon={faCoins} /><span className="pl-1">{costOfReservation}</span></span></h1>
                  <h1 className="text-lg font-bold">Available: <span className="text-primary pl-1"><FontAwesomeIcon icon={faCoins} /><span className="pl-1">{numberOfChargerTokens}</span></span></h1>
                </div>

                <div className={`modal-action w-full ${(selectableHours !== null && selectedDate !== null) ? '' : 'invisible'}`}>
                  <label htmlFor="my-modal-6" className="btn w-full" onClick={() => { reserveTime() }}>Reserve</label>
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