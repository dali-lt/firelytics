import './CSS/style.css'
import CoverBtnBox from './Images/CoverBtnBox.png'

function BtnBox(){

    return(
        <div className="BtnBox">
            <img src={ CoverBtnBox } alt="" />
            <button className="cta-button">Essayer les outils maintenant</button>
        </div>
    )
}

export default BtnBox