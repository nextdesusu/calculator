import React from 'react';
import './Menu.css';

export default function Menu(props) {
    const {
        children,
        tabList,
        changeTab,
        onTab,
    } = props;
    const [ common ] = children;
    const currentTab = children[onTab + 1];
    return (
        <section className='menu'>
            <div className='menu-header' onClick={changeTab}>
                {
                    tabList.map((tabData, i) => {
                        return (
                            <button
                                key={i}
                                className={`menu-tab${onTab === i ? 'menu-tab-highlited' : ''}`}
                                data-index={i}
                            >
                                {tabData}
                            </button>
                        )
                    })
                }
            </div>
            <div className='menu-main'>
                {common}
                {currentTab}
            </div>
        </section>
    )
}
