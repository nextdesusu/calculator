import React from 'react';
import './Menu.css';

export default function Menu(props) {
    const {
        children,
    } = props;
    return (
        <section className='LoanPage'>{children}</section>
    )
}