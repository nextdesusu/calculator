import React from 'react';
import './SelectRow.css';

export default function SelectRow(props) {
    const {
        name,
        text,
        onChange,
        data,
        highlited
    } = props;
    return (
        <div className='SelectRow'>
            <div className='SelectRow-header-wrapper'>
                <h2 className='SelectRow-header'>{text}</h2>
            </div>
            <div className='SelectRow-main'>
                {data.map((val, i) => {
                    return (
                        <label
                            key={i}
                            className={`SelectRow-container${highlited === i ? ' container-highlited' : ''}`}
                        >
                            <input
                                className='SelectRow-checkbox'
                                onChange={onChange}
                                type='radio'
                                name={name}
                                data-index={i}
                                checked={highlited === i}
                            >
                            </input>
                            <span className='checkmark'>{val}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}