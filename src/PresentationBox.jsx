import './CSS/style.css'
import WhatIs from './Images/WhatIs1.png'

function PresBox (){

    return(
        <main>
            <div className="BoxDroite">
                <h3>Qu'est-ce que Firelytics ?</h3>
                <p>
                    Firelytics vise à analyser les données des incendies de forêt dans la région 
                    de Nabeul en utilisant des techniques d'intelligence artificielle pour fournir 
                    des prédictions précises aidant à la prévention et à la gestion des 
                    catastrophes. <br />
                    En collectant des données climatiques et environnementales, nous proposons 
                    des solutions innovantes pour identifier les zones les plus à risque et fournir 
                    des recommandations efficaces pour limiter les dégâts. Notre objectif est de 
                    protéger les forêts et les communautés environnantes en utilisant la technologie 
                    moderne.
                </p>
            </div>
            <div className="BoxGauche">
                <img src={ WhatIs } alt="" />
            </div>
        </main>
    )
}

export default PresBox