import './CurrentWeather.css'
import Location from "../../assets/icons/location.png"
import AiLoading from "./img/aiLoading.gif"

function CurrentWeather({className, description, temperature, city, country, humidity, aiResponse, timedate, windspeed,icon}) {    
    
    return(
        <div className={className}>
            <div className='current-weather-info-container'>
                <p>{description}</p> {icon ? (<div id='icon'><img src={icon}/></div> ) : ''}
                <div className='current-weather-detail'>
                    {aiResponse ? (<p>{aiResponse}</p>) : (<img src={AiLoading} alt="Loading..." />)}
                </div>
                <br/>
                <br/>
                <p id="temperature">{temperature}° </p>
                <img id="location-icon" src={Location} alt="location" />
                <p id="location">{city}, {country}</p>
                <p id="humidity">Humidity : {humidity}%</p>
                {timedate? (<p id="timedate">{timedate}</p>) : ''}
                {windspeed? (<p id="windspeed">{windspeed}</p>) : '' }
            </div>
        </div>
    )
}

export default CurrentWeather;
