import './App.css';
import { useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [humidity, setHumidity] = useState(null)
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const geocodingApiKey = "4f4cab38624d4e3aa7106718aeea913f"; 
  const weatherApiKey = "e8560341fa9e461ec8fd8b0a24819e86"; 

  const cityChange = (e) => {
    setCity(e.target.value);
  };

  const getCoordinates = async () => {
    if (!city) return;
    setError(null);

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodingApiKey}`
      );
      if (!response.ok) {
        throw new Error('No se pudo obtener la ubicación');
      }
      const data = await response.json();

      if (data.results.length > 0) {
        const location = data.results[0].geometry;
        setLat(location.lat);
        setLon(location.lng);
        conditionals(location.lat, location.lng); 
      } else {
        throw new Error('No se encontro la ciudad');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const conditionals = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`
      );
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del clima');
      }
      const data = await response.json();
      setTemp(data.main.temp);
      setWindSpeed(data.wind.speed); 
      setHumidity(data.main.humidity);
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={cityChange}
        placeholder="Ciudad"
      />
      <button onClick={getCoordinates}>Obtener Clima</button>

      {lat !== null && lon !== null && (
        <p>Latitud: {lat}, Longitud: {lon}</p>
      )}
      {temp !== null && (
        <p>Temperatura: {temp}°C</p>
      )}
      {windSpeed !== null && (
        <p>Velocidad del viento: {windSpeed} m/s</p>
      )}
      {humidity !== null && (
        <p>humedad en el ambiente: {humidity}% </p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
