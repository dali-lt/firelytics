import './CSS/style.css'
import FB from './Images/FacebookIcon.svg'
import INS from './Images/InstagramIcon.svg'
import WA from './Images/WhatsappIcon.svg'

function FootBox() {

    return(
        <footer>
            <hr />
            <div className="sociel-icons">
                <a href="#" target="_blank"><img src={ FB } alt="" /></a>
                <a href="#" target="_blank"><img src={ INS } alt="" /></a>
                <a href="#" target="_blank"><img src={ WA } alt="" /></a>
            </div>
        </footer>
    )
}

export default FootBox