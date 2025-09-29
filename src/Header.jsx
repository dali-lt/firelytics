import CoverHeader from './Images/CoverHeader.png'
import './CSS/style.css'

function Header() {
    return(
        <>
            <header>
                <img src={ CoverHeader } alt="" />
                <h1>
                     Analyse et prédiction des incendies de forêt
                     dans la région de Nabeul utilisant l'intelligence
                     artificielle
                </h1>
            </header>
        </>
    )
}

export default Header