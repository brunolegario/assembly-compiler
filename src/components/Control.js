import React, { Fragment } from 'react';

import './Control.scss';



export default class Control extends React.Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
            <section className='control container'>
                <label className='label'>CONTROLE</label>
                <div className='content'>
                    { this.renderContent() }
                </div>
            </section>
        );
    }

    renderContent() {
        return (
            <Fragment>
                <div className='flex row' style={{ height: '21%', marginBottom: '1rem' }}>
                    { this.renderVariableField('ACCUMULATOR', 'ac') }
                    { this.renderVariableField('ACCUMULATOR 2', 'ac2') }
                    { this.renderVariableField('ACCUMULATOR 3', 'ac3') }
                </div>

                <div className='flex row' style={{ height: '21%', marginBottom: '1rem' }}>
                    { this.renderVariableField('CURSOR X', 'x') }
                    { this.renderVariableField('CURSOR Y', 'y') }
                </div>

                <div className='flex row' style={{ height: '21%', marginBottom: '1rem' }}>
                    { this.renderVariableField('PROGRAM COUNTER', 'pc') }
                </div>

                <div className='flex row' style={{ height: '21%', marginBottom: '1rem' }}>
                    { this.renderVariableField('ZERO', 'z') }
                    { this.renderVariableField('NEGATIVE', 'n') }
                    { this.renderVariableField('POSITIVE', 'p') }
                </div>
            </Fragment>
        );
    }


    renderVariableField = (label, el) => {
        let element = this.props.control[el];

        return (
            <div
                className={`variable container ${ element !== '' && element !== '•••' ? 'filled' : 'unfilled'}`}
                style={{ fontSize: element !== '' && element !== '•••' ? '2.6rem' : '1.5rem'}}>
                <label
                    className={`label ${ element !== '' && element !== '•••' ? 'filled' : 'unfilled'}`}
                    >
                    { label }
                </label>
                { element }
            </div>
        );
    }
}
