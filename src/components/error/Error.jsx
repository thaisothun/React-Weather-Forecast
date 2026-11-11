import Fail from "./img/fail.gif"
import Success from "./img/success.gif"
import "./Error.css"

function Error({connect, errorText}){
    console.log(errorText)
    if (connect){
        if (errorText){
         return <div className='notification'>
                <div className="Fail-city">
                <img src={Fail} />
                <span>City : {errorText}</span>
            </div>
        </div>
    } else{
        return <div className='notification'>
                    <div className="Success">
                    <img src={Success} />
                    <span>Connection Success</span>
                </div>
                </div>}
    
  } else {
    return <div className='notification'>
                <div className="Fail">
                <img src={Fail} />
                <span>Connection Fail! Please check your internet connection</span>
            </div>
        </div>
  }
    
}

export default Error