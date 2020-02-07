import React from 'react';
import './Input.css';

const Input = (props) => {
    const {
        onChange,
        symbol,
        initial,
        name,
        preSymbol,
    } = props;
    const styleSpan = {
        order: preSymbol ? 0 : 1,
    }
    const styleInput = {
        order: preSymbol ? 1 : 0,
    }
    return (
        <div className='input-wrapper'>
            <span style={styleSpan} className='input-symbol'>
                {symbol}
            </span>
            <input
                style={styleInput}
                name={name}
                className='input-element'
                onChange={onChange}
                value={initial}
            >    
            </input>
        </div>
    )
}

export default Input;