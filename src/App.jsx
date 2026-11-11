import Background from './components/background/Background';
import './App.css';
import {useState, useEffect} from 'react';
import SearchBar from './components/search_bar/SearchBar';
import Logo from "./assets/icons/24hLogo.png"
import Cloud1 from "./assets/background_img/cloud1.png";
import CurrentWeather from './components/current_weather_card/CurrentWeather';
import {GoogleGenAI} from '@google/genai';
import LoadingOverlay from './assets/background_img/loading.gif'
import ForecastWeather from './components/forecast_weather_card/ForecastWeather';
import WeatherWidget1 from './components/weather_widget/WeatherWidget1';
import WeatherWidget2 from './components/weather_widget/WeatherWidget2';
import Error from './components/error/Error';

function App() {
    const [background, setBackground] = useState(new URL('./assets/background_img/10d.jpg',import.meta.url).href);
    const [city, setCity] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecastWeather, setForecastWeather] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [isAnimated, setIsAnimated] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isUserLocationLoading, setIsUserLocationLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false)
    const [connectError, setConnectError] = useState(null)
    const customFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });

    useEffect(()=>{
        if(city === null) return
        const getCurrentWeather = async () =>{ 
            const api_key = import.meta.env.VITE_API_KEY
            const current_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
            try{
                const response = await fetch(current_url);
                if (!response.ok) {
                    setConnectError(response.statusText)
                    
                    }
                const data = await response.json();
                const weatherInfo = {
                    'date' : data.date,
                    'city' : data.name,
                    'temperature' : Math.round(data.main.temp),
                    'description' : data.weather[0].description,
                    'icon' : data.weather[0].icon,
                    'humidity' : data.main.humidity,
                    'wind_speed' : data.wind.speed,
                    'wind_deg' : data.wind.deg,
                    'wind_gust' : data.wind.gust,
                    'country' : data.sys.country,
                    'humidity' : data.main.humidity,
                    'timezone' : data.timezone,
                    'sunrise' : new Date(data.sys.sunrise * 1000),
                    'sunset' : new Date(data.sys.sunset * 1000),
                    }
                setCurrentWeather(weatherInfo)
                setConnectError(null)
            }catch(error){
                console.log("Error fetching cities:", error);
                
            }finally {
                
            }
        };

        const getForecastWeather = async () =>{ 
            const api_key = import.meta.env.VITE_API_KEY
            const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&exclude=current,minutely,hourly,alerts&appid=${api_key}`
            try{
                const response = await fetch(forecast_url);
                if (!response.ok) {
                    setConnectError(response.statusText)
                    }
                const data = await response.json();
                const forecastInfo = []
                for (let i = 7; i < data.list.length; i+=8){
                    forecastInfo.push({
                        'date' : new Date(data.list[i].dt * 1000),
                        'temperature' : Math.round(data.list[i].main.temp),
                        'description' : data.list[i].weather[0].description,
                        'icon' : data.list[i].weather[0].icon,
                        'humidity' : data.list[i].main.humidity,
                        'wind_speed' : data.list[i].wind.speed,
                        'country' : data.city.country,
                        'city' : data.city.name
                    } )
                    }
                setForecastWeather(forecastInfo);
                setConnectError(null)
                
            }catch(error){
                console.error("Error fetching cities:", error);
                
            }finally {
                
            }
        };
        getCurrentWeather()   
        getForecastWeather()     
    },[city])

    useEffect(()=>{
        if(currentWeather==null) return
        const newBackgroundImageUrl = new URL(`./assets/background_img/${currentWeather.icon}.jpg`, import.meta.url).href;
        setBackground(newBackgroundImageUrl);
        setIsAnimated(true)
        const ai = async() => {
        setIsAiLoading(true);
        try{
            const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
            console.log(`dadfd : ${GEMINI_API_KEY}`)
            const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: `Role: Act as a helpful personal assistant.
                            Task: Look up or use the current weather data for ${currentWeather?.city} time ${dateTime.getTime()}.
                            Include:
                            • ${currentWeather?.temperature} and write a details description with expect condition for whole day using weather description 
                            ${currentWeather?.description} humidity ${currentWeather?.humidity} wind speed ${currentWeather?.wind_speed} wind gust ${currentWeather?.wind_gust}
                            • Practical recommendations
                            • write as new paragraph sentence for recommendations
                            Tone: Light, encouraging, and brief (under 200 words).`,
            });
            setAiResponse(response.text);
        } catch(error) {
            console.error("Error generating AI response:", error);
            setAiError('Ai Response Fail...');
        } finally {
            setIsAiLoading(false);}
        }
        ai()          
    
    },[currentWeather,forecastWeather])

    useEffect(() => {
    // Update the state every second
        const timer = setInterval(() => {
        setDateTime(new Date());
        }, 1000);

        // Clear the interval when the component unmounts to prevent memory leaks
        return () => clearInterval(timer);
    }, []);

    useEffect(() =>{
        const getUserLocaton = async () => {
            setIsUserLocationLoading(true);
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json'); 
                const ipData = await ipRes.json();
                const userIp = ipData.ip;
                const geoRes = await fetch(`https://ipapi.co/${userIp}/json/`);
                const geoData = await geoRes.json();
                setCity(geoData.city);
                setIsConnected(true)
            } catch (error) {
                console.error("Error fetching user IP:", error);
                setInterval(getUserLocaton(),3000);
                setIsConnected(false)
            } finally {
                setIsUserLocationLoading(false);
            }}
        
        getUserLocaton()
    },[])
    
    function receiveDataSearchBar(city){
        setCity(city)
    }

    function handleTransitionEnd(e) {
        if (e.propertyName === 'transform') {
        setIsAnimated(false);}
    }
  
    return(
        <div>
            <Error connect = { isConnected } errorText = {connectError} />
            {isUserLocationLoading && <div className="loading-overlay">
                <img src={LoadingOverlay} alt="Loading..." /> </div>}
            <Background className="background" url={background} />
            <div className={`clouds-container ${isAnimated ? 'animated' : ''}`}>
                <img className={`cloud1 ${isAnimated ? 'animated' : ''}`} src={Cloud1} alt="clouds"></img>
                <img onTransitionEnd={handleTransitionEnd} className={`cloud2 ${isAnimated ? 'animated' : ''}`} src={Cloud1} alt="clouds"></img>
                <img className={`cloud3 ${isAnimated ? 'animated' : ''}`} src={Cloud1} alt="clouds"></img>
            </div>
            <div className='header'>
                <div className='logo'>
                    <img src={Logo} alt="logo"></img>
                    <span>Weather Forecast</span>
                </div>
                <SearchBar className="search" placeHolerText="LOCATION" citySelected={receiveDataSearchBar}/>
                <div className='datetime'>
                    <p className='date'> {customFormatter.format(dateTime)}</p>
                    <p className='time'> {dateTime.toLocaleTimeString()}</p>
                </div>
            </div>
            <div className='weather-info'>
                <div className='current-weather'>
                    <CurrentWeather className="current-weather-card" 
                    description={currentWeather?.description} 
                    temperature={currentWeather?.temperature} 
                    city={currentWeather?.city} 
                    country={currentWeather?.country}
                    humidity={currentWeather?.humidity}
                    aiResponse={aiError? aiError : aiResponse}
                    /> 
                </div>
                <div className='weather-widget'>
                    <div className='weather-widget-content'>
                        <WeatherWidget2 currentWeather={currentWeather} />
                    </div>
                    <div className='weather-widget-content'>
                        <WeatherWidget1 currentWeather={currentWeather} />
                    </div>
                </div>
            
            </div>
            <div className='forecast-weather'>
                {forecastWeather? (<ForecastWeather forecaseWeather = {forecastWeather}/>) : ''}
            </div>
        </div>
    )    
}

export default App
