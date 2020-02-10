import React from 'react';
import './ButtonsRow.css';

export default function ButtonsRow(props) {
    const {
        onClick,
        highlited,
        data,
        name,
        text,
    } = props;
    return (
        <div onClick={onClick} className='ButtonsRow-wrapper'>
            <div className='ButtonsRow-header-wrapper'>
                <h2 className='ButtonsRow-header'>{text}</h2>
            </div>
            <div className='ButtonsRow-main'>
                {data.map((dataSrc, index) => {
                    return (
                        <button
                            className={`ButtonsRow-button${index === highlited ? ' ButtonsRow-highlited' : ''}`}
                            data-index={index}
                            key={index}
                            name={name}
                        >
                            {dataSrc}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}