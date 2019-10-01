import React, { Fragment } from 'react';

import './Canvas.scss';



export default class Canvas extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }


    render() {
        return (
            <section className='canvas container'>
                <label className='label'>CANVAS</label>
                <div className='content'>oi</div>
            </section>
        );
    }
}
