import React from 'react';
import './InfoCard.css';

const InfoCard = (props) => {
    const {
        MSRPValue,
        vName,
        monthlyPayment,
        taxesList,
        dName,
        dNumber,
        dRating,
    } = props;
    return (
        <section className='InfoCard'>
            <div className='InfoCard-msrp'>
                <span className='msrp'>msrp</span>
                <span className='msrp-value'>${MSRPValue}</span>
            </div>
            <div className='InfoCard-car'>
                <ul className='InfoCard-list'>
                    <li>{vName}</li>
                    <li>{monthlyPayment}</li>
                    <li>taxes: 
                        <ol>
                            {taxesList.map((taxItem, i) => <li key={i}>{taxItem}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
            <div className='InfoCard-dealer'>
                <ul className='InfoCard-list'>
                    <li>{dName}</li>
                    <li>{dNumber}</li>
                    <li>{dRating}</li>
                </ul>
            </div>
        </section>
    )
}

export default InfoCard;