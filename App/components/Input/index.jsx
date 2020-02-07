import React from 'react';
import './Input.css';

const Input = (props) => {
    const {
        onChange,
        preSymbol,
        initial,
    } = props;
    return (
        <div className='input-wrapper'>
            <span className='input-preSymbol'>{preSymbol}</span>
            <input className='input-element' onChange={onChange} value={initial}></input>
        </div>
    )
}

export default Input;