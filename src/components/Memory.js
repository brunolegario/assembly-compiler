import React from 'react';

import './Memory.scss';



export default class Memory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: Array.from({ length: 256 }).map((u, i) => i)
        }
    }



    render() {
        return (
            <section className='memory container'>
                <label className='label'>MEMÓRIA</label>
                <div className='content'>
                    { this.renderCells() }
                </div>
            </section>
        );
    }

    renderCells() {
        let rendered = [];

        for (let i = 0; i < this.props.content.length; i++) {
            if (typeof this.props.content[i] === 'object' &&
                'value' in this.props.content[i]) {

                rendered.push(this.renderCell(this.props.content[i].value, i));

            } else {
                rendered.push(this.renderCell('•••', i));
            }
        }

        return rendered;
    }

    renderCell(item, i) {
        if (item === '•••') {
            return (
                <div key={i} className='cell unfilled'>
                    { item }
                    <span className='index'>{ i }</span>
                </div>
            );
        }

        return (
            <div key={i} className={`cell filled ${i === this.props.control.pc ? 'current' : null}`}>
                { item }
                <span className='index'>{ i }</span>
            </div>
        );

    }
}
