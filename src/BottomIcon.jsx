import { useState } from 'react';
import './CSS/MapStyle.css';
import Acc from './Images/account.svg'
import Cl from './Images/close.svg'

function BottBox({activeBox, setActiveBox}) {
    const isProfileActive = activeBox ==="profile";

    const toggleProfile = () => {
        setActiveBox(isProfileActive ? null : 'profile');
    }
    /*const [showProfile, setShowProfile] = useState(false);
    const [showProblemModal, setShowProblemModal] = useState(false);

    const toggleProfile = () => {
        setShowProfile(!showProfile)
        setShowProblemModal(!showProblemModal)
    }*/

    return(
        <>
            <div className="bottom-icon">
                <button title='Account' className={`bottom btn-sideBar ${isProfileActive ? 'active' : ''}`} onClick={toggleProfile}>
                    <img src={ Acc } alt="Account" className='icon-img' />
                </button>
            </div>

            {isProfileActive && (
                <div className="profile-box">
                    <button className='close-btn' onClick={toggleProfile}>
                        <img src={ Cl } alt="" />
                    </button>
                    <img src={ Acc } alt="Profile" className='profile-img' />
                    <p className='name'>Mohamed Ali Louati<br /><span>26/02/2003</span></p>
                    <button className='logout-btn'>Se Déconnecter</button>
                </div>
            )}
        </>
    )
}

export default BottBox