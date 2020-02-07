import React from 'react';
import './ButtonsRow.css';

export default function ButtonsRow(props) {
    const {
        onClick,
        highlited,
        data,
    } = props;
    return (
        <div onClick={onClick} className='ButtonsRow-wrapper'>
            {data.map((dataSrc, index) => {
                return (
                    <button
                        className={`ButtonsRow-button${index === highlited ? ' ButtonsRow-highlited' : ''}`}
                        data-index={index}
                        key={index}
                    >
                        {dataSrc}
                    </button>
                )
            })}
        </div>
    )
}