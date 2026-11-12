import "./ForecastWeather.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import React from 'react';
import {useState} from 'react';
import CurrentWeather from "../current_weather_card/CurrentWeather";
import {GoogleGenAI} from '@google/genai';

function ForecastWeather({forecaseWeather}) {
    const [isActive , setIsActive] = useState(false)
    const [forecaseWeatherDetail , setForecastWeatherDetail] = useState('')
    const [aiError, setAiError] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    
    const customFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        }); 
        
    const customFormatter1 = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    
    const dataChart = []
    forecaseWeather.forEach((item)=>{
        dataChart.push({
            'date' : customFormatter.format(item.date),
            'temperature' : item.temperature,
            'icon_url' : new URL(`./icons/${item.icon}.png`, import.meta.url).href})
        })

function handlePointClick (dataPoint, index) {
    setIsActive(true)
    const foreCastDetail = forecaseWeather.filter((item)=>{
        if ((customFormatter.format(item.date)) === (dataPoint.date)){
            return item
        }
    })
    setForecastWeatherDetail(foreCastDetail)
    const ai = async() => {
        setIsAiLoading(true);
        try{
            const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
            const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: `Role: Act as a helpful personal assistant.
                            Task: Look up or use the current weather data for ${forecaseWeatherDetail[0].city} time ${forecaseWeatherDetail[0].date.getDate()}.
                            Include:
                            • ${forecaseWeatherDetail[0]?.temperature} and write a details description with expect condition for whole day using weather description 
                            ${forecaseWeatherDetail[0].description} humidity ${forecaseWeatherDetail[0].humidity} wind speed ${foreCastDetail[0]?.wind_speed} wind gust ${foreCastDetail[0]?.wind_gust} 
                            • Practical recommendations
                            • write as new paragraph sentence for recommendations
                            Tone: Light, encouraging, and brief (under 200 words).`,
            });
            setAiResponse(response.text);
            console.log(foreCastDetail)
        } catch(error) {
            console.error("Error generating AI response:", error);
            setAiError('Ai Response Fail...');
        } finally {
            setIsAiLoading(false);}
        }
        ai()          
  };

    const CustomIconDot = (props) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;
    const size = 40; // Width and height of the icon
    const padding = 6; // Space between border and the image
    const imgSize = size - padding * 2.5;
    return (
        <g transform={`translate(${cx - size / 2}, ${cy - size / 2})`} className="chart-point-group">
        <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2} 
        className="point-background-border"
        />
        <image className="point-image"
            href={payload.icon_url}
            x={padding}
            y={padding}
            width={imgSize}
            height={imgSize}
            preserveAspectRatio="xMidYMid slice"
        />
        </g>
    );
    };
   
    return(
        <>
        <div className={`forecaseWeather-detail ${isActive? 'active' : ''}`}>
            <div className='current-weather'>
                <CurrentWeather className="current-weather-card" 
                description={forecaseWeatherDetail[0]?.description} 
                temperature={forecaseWeatherDetail[0]?.temperature} 
                city={forecaseWeatherDetail[0]?.city} 
                country={forecaseWeatherDetail[0]?.country}
                humidity={forecaseWeatherDetail[0]?.humidity}
                aiResponse={aiError? aiError : aiResponse}
                timedate={customFormatter1.format(forecaseWeatherDetail[0]?.date)}
                windspeed={`${Math.round((forecaseWeatherDetail[0]?.wind_speed)*3.6)} KM/H`}
                icon={new URL(`./icons/${forecaseWeatherDetail[0]?.icon}.png`, import.meta.url).href}
                /> 
            </div>
            <button onClick={()=>{setIsActive(false)}}> &#x3c; back</button>
        </div>
        <div className="temperature">
            {forecaseWeather.map((item, index)=>(
                <React.Fragment key={index}>
                    <div>
                    <p>{customFormatter.format(item.date)}</p>
                    <p>{item.temperature}° </p>
                    </div>
                </React.Fragment>    
            ))}
        </div>
        <div className="chart">
            <ResponsiveContainer>
            <LineChart data={dataChart} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="date" tick={false} axisLine={false} />
            <YAxis tick={false} axisLine={false}/>
            <Line
                type="monotone"
                dataKey="temperature"
                stroke="#b5e61dcc"
                strokeWidth={2}
                dot={<CustomIconDot />}
                activeDot={{fill: 'transparent', stroke: 'transparent', r:25, cursor: 'pointer', onClick: (e, payload) => handlePointClick(payload.payload, payload.index)}}
            />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </>
        )
}

export default ForecastWeather