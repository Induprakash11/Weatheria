import { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(null);
  const [iconUrl, setIconUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeatherData = async () => {
    if (!search) return;

    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=b5f4b785fe335cd7c3cb967cced58825&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const result = await response.json();
      setCity(result);

      // Fetch the weather icon URL
      const iconCode = result.weather?.[0]?.icon; // Example: "01d"
      if (iconCode) {
        setIconUrl(`http://openweathermap.org/img/wn/${iconCode}@2x.png`);
      }

      setError('');
    } catch (error) {
      setError(error.message);
      setCity(null);
      setIconUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, [search]);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type="text"
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button style={{ cursor: 'pointer' }} onClick={() => setSearch(searchTerm)}>
          <img
          src={search_icon}
          alt="Search Icon"
        /></button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="loading">Fetching weather data...</p>}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Weather Data Display */}
      {city && !loading && (
        <>
          <img src={iconUrl} alt="Weather Icon" className='weather-icon' />
          <p className='temperature'>{city?.main?.temp}&#176;c</p>
          <p className='location'>{city?.name}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{city?.main?.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt="Wind Icon" />
              <div>
                <p>{city?.wind?.speed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;