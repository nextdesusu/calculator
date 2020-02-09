import React from 'react';
import './Input.css';

const Input = (props) => {
    const {
        onChange,
        symbol,
        value,
        name,
        preSymbol,
        type,
        max,
        errorText,
    } = props;
    const styleSpan = {
        order: preSymbol ? 0 : 1,
    }
    const styleInput = {
        order: preSymbol ? 1 : 0,
    }
    return (
        <div>
            <div className='input-wrapper'>
                <span style={styleSpan} className='input-symbol'>
                    {symbol}
                </span>
                <input
                    style={styleInput}
                    name={name}
                    className='input-element'
                    onChange={onChange}
                    value={value}
                    type={type ? type : 'number'}
                    max={max}
                >
                </input>
            </div>
            {errorText && <span>{errorText}</span>}
        </div>
    )
}

export default Input;