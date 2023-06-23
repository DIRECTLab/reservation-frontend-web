import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import api from "../api";

function rgb2hex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw "Invalid color component";
  }
  return ((r << 16) | (g << 8) | b).toString(16);
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
    return rgb2hex(this.r * 255, this.g * 255, this.b * 255);
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




const ReserveModal = ({ token, encodedToken, charger, setError, setAlertMessage, setAlert }) => {
  const [dateSet, setDateSet] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: null });
  const [selectedHour, setSelectedHour] = useState(new Date().getHours() + 1);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectableHours, setSelectableHours] = useState([]);
  const [chargeAmount, setChargeAmount] = useState(50);
  const [optimalChargeRange, setOptimalChargeRange] = useState({});


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
  const yellow = new Color(255 / 255, 255 / 255, 1 / 255);
  const green = new Color(123 / 255, 182 / 255, 98 / 255);


  const setSliderColor = () => {
    const gradient = new Gradient([yellow, green, green, red], [0, optimalChargeRange.low, optimalChargeRange.high, 100]);
    let color = `#${gradient.evaluate(chargeAmount)}`;
    root.style.setProperty('--sliderColor', color);
  }

  useEffect(() => {
    loadNewRange();
    setSliderColor();
  }, [selectedDate, selectedHour]);

  useEffect(() => {
    setSliderColor();
  }, [chargeAmount]);


  const handleSliderInput = (event) => {
    setChargeAmount(event.target.value);
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

                <div className="range mt-4">
                  <input
                    type="range"
                    id="chargeSlider"
                    min={0}
                    max={100}
                    value={chargeAmount}
                    onChange={handleSliderInput}
                  />
                </div>

                <div className="w-full flex flex-row mt-2">
                  <span className="text-xs flex-auto">Slowest Rate</span>
                  <span className="text-xs flex-auto text-right">Fastest Rate</span>
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