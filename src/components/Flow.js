import React, { Fragment } from 'react';

import './Flow.scss';



export default class Flow extends React.Component {

    constructor(props) {
        super(props);
    }



    render() {
        let indexMemory = this.props.memory.findIndex(item => typeof item === 'object');
        let pc = this.props.control.pc;

        return (
            <section className='flow container'>
                <label className='label'>FLOW</label>
                <div className='content'>
                    <button
                        className='button'
                        onClick={this.props.onRead}
                        disabled={indexMemory !== -1 ? true : false}>
                        READ
                    </button>

                    <button
                        className='button'
                        onClick={this.props.onStart}
                        disabled={indexMemory !== -1 ? false : true}>
                        START
                    </button>

                    <button
                        className='button'
                        onClick={this.props.onReset}>
                        RESET
                    </button>


                    <button
                        className='button yellow'
                        disabled={ pc === '' ? true : false }
                        onClick={() => this.props.onAdvanceProgramStep()}>
                        + 1
                    </button>
                    <button
                        className='button yellow'
                        disabled={ pc === '' ? true : false }
                        onClick={() => this.props.onAdvanceProgramAll()}>
                        + ALL
                    </button>
                </div>
            </section>
        )
    }
}
