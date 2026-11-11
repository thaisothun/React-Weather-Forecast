import './Background.css'

function Background({url, className}) {
    return(
    <div className={className}>
        <img src= {url} alt="background"/>

    </div>
)

}

export default Background;