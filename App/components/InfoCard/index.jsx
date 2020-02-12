import React from 'react';
import './InfoCard.css';

const InfoCard = (props) => {
    const {
        data,
        taxesList,
    } = props;
    const { isLoaded } = data;
    const {
        msrp,
        vName,
        monthlyPayment,
        dName,
        dNumber,
        dRating,
    } = data.data;
    const getLoadedTemplate = () => {
        return (
            <React.Fragment>
                <div className='InfoCard-msrp'>
                    <h2 className='msrp'>
                        msrp <span className='money'>${msrp}</span>
                    </h2>
                </div>
                <div className='InfoCard-car'>
                    <ul className='InfoCard-list'>
                        <li>vehicle: {vName}</li>
                        <li>monthly payment: <span className='money'>{monthlyPayment}$</span></li>
                        <li>taxes: 
                            <ul className='InfoCard-list-taxes'>
                                {
                                    taxesList.map((taxItem, i) => {
                                        return (
                                            <li key={i}>
                                                <span className='money'>
                                                    {taxItem}$
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='InfoCard-dealer'>
                    <ul className='InfoCard-list'>
                        <li>dealer name: {dName}</li>
                        <li>phone number: {dNumber}</li>
                        <li>rating: {dRating} stars</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
    return (
        <section className='InfoCard'>
            {isLoaded ? getLoadedTemplate() : <div className='spinner'></div>}
        </section>
    )
}

export default InfoCard;