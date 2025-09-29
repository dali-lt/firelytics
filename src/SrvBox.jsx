import './CSS/style.css'
import ClassIcon from './Images/ClassementIcon.svg'
import PréIcon from './Images/PrédictionIcon.svg'
import AnaIcon from './Images/AnalyseIcon.svg'

function SrvBox (){

    return(
        <div className="services-container">
            <div className="service-box">
                <div className="icon"><img src={ ClassIcon } alt="" /></div>
                <h3>Classement des forêts</h3>
                <p>
                    Classer les forêts selon leur risque d'incendie.
                </p>
            </div>
            <div className="service-box">
                <div className="icon"><img src={ PréIcon } alt="" /></div>
                <h3>Prédiction des incendies</h3>
                <p>
                    Prédire les incendies en fonction des facteurs climatiques.
                </p>
            </div>
            <div className="service-box">
                <div className="icon"><img src={ AnaIcon } alt="" /></div>
                <h3>Analyse temporelle</h3>
                <p>
                    Analyser l'evolution des incendies dans le temps.
                </p>
            </div>
        </div>
    )
}

export default SrvBox