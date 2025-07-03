"use client";

import { useEffect, useState } from "react";
import "./App.css";
import weatherCodes from "./weatherDescription";

const weatherIcons = ["/bright.svg", "/cloudy.svg", "/rain.svg"];

const hadiths = [
  {
    hadith:
      "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَى بِهِ كَثِيرًا مِنْ خَلْقِهِ، وَفَضَّلَنِي عَلَىٰ كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا",
    translate:
      "“All praise is due to Allah who has protected me from what He has tested many of His creation with, and has favored me greatly over many of those He has created.”",
    narrated: "Narrated by at-Tirmidhi, Abu Dawood, and others.",
  },
  {
    hadith:
      "اللَّهُمَّ اجْعَلْهَا رَحْمَةً وَلَا تَجْعَلْهَا عَذَابًا،اللَّهُمَّ اجْعَلْهَا رِيَاحًا وَلَا تَجْعَلْهَا رِيحًا",
    translate:
      "“O Allah, make it a mercy and do not make it a punishment. O Allah, make it winds (gentle and scattered) and do not make it a single (destructive) wind.”",
    narrated: "Narrated by Ibn Majah & Ahmad.",
  },
  {
    hadith: " اللَّهُمَّ صَيِّبًا نَافِعًا اللَّهُمَّ صَيِّبًا هَنِيئًا",
    translate: "“O Allah, (bring) beneficial rain.”",
    narrated: "Narrated by al-Bukhari in Sahih al-Bukhari.",
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Navbar = () => {
  const handleClick = () => {
    localStorage.setItem("weatherAppName", "");
    location.reload();
  };
  return (
    <nav className="grid place-items-center fixed py-2 right-0 min-h-screen">
      <p
        className="cursor-pointer text-white  hover:bg-white hover:text-black flex flex-col opacity-50 hover:opacity-100"
        onClick={handleClick}
        style={{
          transition: "all ease-in-out 250ms",
        }}
      >
        <img src="/nav.svg" alt="" />
      </p>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="w-full grid place-items-center">
      <p>
        Made with ❤️ by{" "}
        <a href="https://ahmadshiddiqy.kodein.sch.id" target="blank">
          Diqy
        </a>
      </p>
    </footer>
  );
};

export default function App() {
  const [infoData, setInfoData] = useState();
  const [temperature, setTemperature] = useState(String);
  const [wind, setWind] = useState(String);
  const [cuaca, setCuaca] = useState(Number);
  const [cuacaWMO, setCuacaWMO] = useState();
  const [lokasi, setLokasi] = useState(String);
  const [name, setName] = useState("");
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [clock, setClock] = useState();
  const [amPm, setAmPm] = useState("");
  const [date, setDate] = useState();
  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      localStorage.setItem("weatherAppName", name);
      setIsNameSaved(true);
    }
  };
  useEffect(() => {
    const storedName = localStorage.getItem("weatherAppName");
    if (storedName) {
      setName(storedName);
      setIsNameSaved(true);
    }
    setInterval(() => {
      const now = new Date();
      const minutes = now.getMinutes();
      const hours = now.getHours();
      const formattedTime = now.toLocaleTimeString();
      const amPm = formattedTime.slice(-2);
      const dateNow = now.getDate();
      const monthNow = now.getMonth();
      const yearNow = now.getFullYear();
      const day = now.getDay();
      setAmPm(amPm);
      setDate(`${days[day]}, ${dateNow} ${months[monthNow]} ${yearNow}`);
      setClock(
        `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`
      );
    }, 1000);
  }, []);
  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();
        const locationRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const locationData = await locationRes.json();
        setInfoData(data);
        setTemperature(
          `${data.current_weather.temperature} ${data.current_weather_units.temperature}`
        );
        setWind(
          `${data.current_weather.windspeed} ${data.current_weather_units.windspeed}`
        );
        setCuaca(data.current_weather.weathercode);
        setCuacaWMO(
          `${
            cuaca < 3
              ? "Bright"
              : cuaca == 3
              ? "Cloudy"
              : cuaca > 3 && cuaca <= 80
              ? "Overcast"
              : cuaca >= 81
              ? "Rainy"
              : ""
          }`
        );
        setLokasi(
          `${
            locationData.address.city === undefined
              ? ""
              : locationData.address.city + ","
          } ${locationData.address.country}`
        );
      });
    } catch (error) {
      console.log("hahaaaaa");
    }
  });
  return (
    <>
      {isNameSaved ? (
        <>
          <Navbar />
          <main
            className="w-full min-h-screen flex justify-between items-center bg-no-repeat bg-cover text-white p-4 bg-fixed gap-4 max-[800px]:flex-col max-[800px]:gap-12"
            style={{
              backgroundImage: `${
                cuaca < 3
                  ? "url(/bright.jpg)"
                  : cuaca == 3
                  ? "url(/cloudy.png)"
                  : cuaca > 3 && cuaca <= 80
                  ? "url(/cloudy.png)"
                  : cuaca >= 81
                  ? "url(/rain.jpg)"
                  : ""
              }`,
              transition: "all ease-in-out 1000ms",
            }}
          >
            <div
              className="max-w-[600px] w-full flex flex-col min-h-[95svh] backdrop-blur-[1rem] rounded-2xl p-6 justify-between max-[800px]:min-h-fit max-[800px]:flex-col-reverse max-[800px]:gap-12"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="flex flex-col gap-4 leading-[100%]">
                <img
                  src={
                    cuaca < 3
                      ? weatherIcons[0]
                      : cuaca == 3
                      ? weatherIcons[1]
                      : cuaca > 3 && cuaca <= 80
                      ? weatherIcons[1]
                      : cuaca >= 81
                      ? weatherIcons[2]
                      : ""
                  }
                  alt=""
                  style={{
                    maxWidth: "120px",
                  }}
                />
                <div className="flex text-[4rem] justify-center items-center w-fit gap-6 font-[200] max-[1088px]:text-[3rem] max-[875px]:text-[2.5rem] max-[800px]:text-[2.1rem] max-[800px]:gap-4">
                  <p>{cuacaWMO}</p>
                  <div
                    className="min-w-[2px] min-h-[60px] h-full"
                    style={{ backgroundColor: "#D9D9D9", opacity: "0.2" }}
                  ></div>
                  <p className="flex justify-center items-center w-fit">
                    {temperature}
                  </p>
                </div>
                <p>
                  {capitalizeFirstLetter(
                    weatherCodes[cuaca].description.toLowerCase()
                  )}
                  .
                </p>
                <p className="flex justify-center items-center w-fit">
                  <span>Windspeed</span>
                  <span className="ml-1">: {wind}</span>
                  <img src="/windSpeed.svg" alt="" className="ml-1" />
                </p>
              </div>
              <div className="flex w-full justify-between items-end max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-4">
                <div className="flex flex-col gap-4">
                  <p>{lokasi}</p>
                  <p className="text-[4rem] font-medium leading-[100%] max-[875px]:text-[2.5rem]">
                    {clock}
                  </p>
                </div>
                <p>{date}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-4 max-[800px]:gap-6 pb-16">
              <p className="text-[18px]">
                Hi{" "}
                <span className="font-bold">{capitalizeFirstLetter(name)}</span>
                !
              </p>
              <p className="text-5xl text-center max-w-[600px] max-[875px]:text-4xl max-[800px]:text-[2rem] max-[800px]:max-w-[310px]">
                {cuaca < 3
                  ? hadiths[0].hadith
                  : cuaca == 3
                  ? hadiths[1].hadith
                  : cuaca > 3 && cuaca <= 80
                  ? hadiths[1].hadith
                  : cuaca >= 81
                  ? hadiths[2].hadith
                  : ""}
              </p>
              <p className="text-center max-w-[600px] max-[800px]:max-w-[310px]">
                {cuaca < 3
                  ? hadiths[0].translate
                  : cuaca == 3
                  ? hadiths[1].translate
                  : cuaca > 3 && cuaca <= 80
                  ? hadiths[1].translate
                  : cuaca >= 81
                  ? hadiths[2].translate
                  : ""}
              </p>
              <p className="text-center max-w-[600px] text-[14px]">
                {cuaca < 3
                  ? hadiths[0].narrated
                  : cuaca == 3
                  ? hadiths[1].narrated
                  : cuaca > 3 && cuaca <= 80
                  ? hadiths[1].narrated
                  : cuaca >= 81
                  ? hadiths[2].narrated
                  : ""}
              </p>
            </div>
          </main>
          <Footer />
        </>
      ) : (
        <main
          className="w-full min-h-screen grid place-items-center bg-cover"
          style={{
            backgroundImage: "url(/bright.jpg)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col backdrop-blur-[1rem] px-12 py-6 justify-center items-center gap-4 rounded-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <label htmlFor="nameInput" className="text-white">
              Your name
            </label>
            <input
              type="text"
              className="bg-white text-white input focus:outline-none active:border-none border-none px-4 py-1.5 rounded-2xl"
              id="nameInput"
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            />
            <input
              type="submit"
              className="py-1.5 px-4 w-full border-1 border-solid border-white text-white rounded-2xl hover:bg-white hover:text-black cursor-pointer"
              style={{
                transition: "all ease-in-out 250ms",
              }}
            />
          </form>
        </main>
      )}
    </>
  );
}
