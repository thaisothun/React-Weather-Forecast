import Campass from "./img/compass.png";
import Direction from "./img/direction.png";
import "./WeatherWidget2.css";

function WeatherWidget2(currentWeather){
      
    return(
        <div className="weather-widget2">
            <div className="grid1">
                <p>Wind Speed: {Math.round(currentWeather.currentWeather?.wind_speed*3.6)} KM/H </p>
                <p>Wind GUST: {Math.round(currentWeather.currentWeather?.wind_gust*3.6)}KM/H</p>
            </div>
            <div className="grid2">
                <img id="campass" src={Campass} alt="compass"/>
                <p>{currentWeather.currentWeather?.wind_deg}°</p>
                <div className="animated-direction" style={{transform: currentWeather.currentWeather?.wind_deg>0? `rotate(${-currentWeather.currentWeather?.wind_deg}deg)` : 'rotate(0deg)' }}>
                    <img id="direction" src={Direction} alt="direction"/>
                </div>
            </div>
        </div>
    )
    }

export default WeatherWidget2