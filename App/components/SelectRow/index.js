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
            <span>{text}</span>
            {data.map((val, i) => {
                return (
                    <div key={i}>
                        <input
                            onChange={onChange}
                            type='radio'
                            name={name}
                            data-index={i}
                            checked={highlited === i}
                        >
                        </input>
                        <span>{val}</span>
                    </div>
                )
            })}
        </div>
    )
}