import React from 'react';
import './InfoCard.css';

const InfoCard = (props) => {
    const {
        data,
    } = props;
    const { isLoaded } = data;
    const {
        msrp,
        vName,
        monthlyPayment,
        taxesList,
        dName,
        dNumber,
        dRating,
    } = data.data;
    const getLoadedTemplate = () => {
        return (
            <React.Fragment>
                <div className='InfoCard-msrp'>
                    <span className='msrp'>msrp</span>
                    <span className='msrp-value'>${msrp}</span>
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