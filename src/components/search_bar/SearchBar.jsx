import SearchIcon from "../../assets/icons/search.png";
import './SearchBar.css'
import {useState, useEffect, useRef, useMemo} from 'react';

function SearchBar({placeHolerText, className, citySelected}) {
    const [isMouseClicked, setIsMouseClicked] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchIputValue, setSearchInputValue] = useState("");
    const inputRef = useRef(null);
    const [citiesList, setCitiesList] = useState('')
    const [error, setError] = useState(null);
    
    useEffect(()=>{
        if(isMouseClicked){
            inputRef.current.focus();
        }
    }, [isMouseClicked]);

    useEffect(()=>{
        const getCities = async () =>{ 
            try{
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                    }
                const data = await response.json();
                const citiesList = []
                data.data.reduce((acc, item) => {
                    item.cities.forEach((city)=>{
                        citiesList.push({
                            'city' : city,
                            'country' : item.country 
                        })
                    })});
                setCitiesList(citiesList)
            }catch(error){
                console.error("Error fetching cities:", error);
            }finally {
                
            }
        };
        getCities();
        
    }, []);

    const filterCities = useMemo(()=>{
        if (!searchIputValue) return null;
        const filterCities = citiesList.filter((city)=>{
            if(city.city.toLowerCase().startsWith(searchIputValue.toLowerCase())){
                return {'city': city.city, 'country': city.country}
            }  
        })
        return filterCities
    },[searchIputValue]);

    function handleMouseClicked() {
        setIsMouseClicked(true);
        setIsAnimated(true);
    }

    function closeSearchBar() {
        if(searchIputValue) return
        setIsMouseClicked(false);
        setIsAnimated(false);
    }

    function handleChange(e){
        setSearchInputValue(e.target.value);         
    }

    function handleCitySelected(city){
        citySelected(city)
        setSearchInputValue('')
        setIsAnimated(false);
    }

    return(
        <div className={className}>
            <div className={`search-icon-container ${isAnimated ? 'animated' : ''}`}>
                <img onClick={handleMouseClicked} src={SearchIcon} alt="search-icon" className="search-icon"/>
            </div>
            <div className={`search-input-container ${isAnimated ? 'animated' : ''}`}>
                <input value={searchIputValue} ref={inputRef} onBlur={closeSearchBar} onChange={handleChange} type="text" placeholder={placeHolerText} className={`search-input ${isAnimated ? 'animated' : ''}`}/>
            </div>
            <div className={`fliter-list ${filterCities != null ? 'animated' : ''}`}>
                <ul>
                    {filterCities?.length > 0 && ((filterCities.map((city, index)=>(
                    <li key={index} onClick={()=>{handleCitySelected(city.city)}}>{city.city}, {city.country}</li>))))} 
                    {filterCities?.length == 0 && (<li>Not found</li>)}                     
                </ul>
            </div>
        </div>
    )
}

export default SearchBar;