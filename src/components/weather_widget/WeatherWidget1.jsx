import SunIcon from "./img/sun.png"
import './WeatherWidget1.css';
import { useState } from "react";

function WeatherWidget1(currentWeather){
    const [isAnimatedSunRise , setIsanimatedSunRise] = useState(false)
    const [isAnimatedSunSet , setIsanimatedSunSet] = useState(false)
    function handleAnimationSunRise(){
        setIsanimatedSunRise(true)
    }

    function handleAnimationBackSunRise(){
        setIsanimatedSunRise(false)
    }

    function handleAnimationSunSet(){
        setIsanimatedSunSet(true)
        
    }

    function handleAnimationBackSunSet(){
        setIsanimatedSunSet(false)
    }

    return(
        <div>
        <div className='sun'>
            <img src={SunIcon} alt="sun"/>
        </div>
        <div className={`earth ${isAnimatedSunRise ? 'sunrise' : ''} ${isAnimatedSunSet ? 'sunset' : ''}`}>
            
        </div>
        <div className="layer"> 
            <div onMouseEnter={handleAnimationSunRise} onMouseLeave={handleAnimationBackSunRise}>
                <p>Sunrise at {currentWeather.currentWeather?.sunrise.toLocaleTimeString()}</p>
            </div>
            <div onMouseEnter={handleAnimationSunSet} onMouseLeave={handleAnimationBackSunSet}>
                <p>Sunset at {currentWeather.currentWeather?.sunset.toLocaleTimeString()}</p>
            </div>
        </div>
        </div>
    )
}

export default WeatherWidget1