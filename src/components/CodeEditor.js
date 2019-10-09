import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



import './CodeEditor.scss';



export default class CodeEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            value: '.data\n.enddata\n\n.code\n.endcode'
        }

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }



    showMenu = (event) => {
        event.preventDefault();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu = (event) => {
        if (!this.button.contains(event.target)) {
            this.setState({ showMenu: false }, () => {
                document.removeEventListener('click', this.closeMenu);
            })
        }
    }



    render() {
        return (
            <section className='code container'>
                <label className='label'>EDITOR</label>
                <div className='content'>
                    <div style={{ position: 'relative' }}>
                        <button
                            className='toggle flex row'
                            style={{ justifyContent: 'space-between' }}
                            ref={(ref) => this.button = ref}
                            onClick={ this.showMenu }>
                            Selecione
                            <FontAwesomeIcon
                                icon='angle-down'
                                color='#101010' />
                        </button>
                        { this.state.showMenu ? (
                            <ul className='dropdown'>
                                <li onClick={() => this.props.onChangeCode(1)} className='item'>Filled Blue Rectangle</li>
                                <li onClick={() => this.props.onChangeCode(2)} className='item'>Green Rectangle Stroke</li>
                                <li onClick={() => this.props.onChangeCode(3)} className='item'>Random Colored Rectangle</li>
                            </ul>
                        ) : (
                            null
                        )}
                    </div>

                    <div className='input-container'>
                        <textarea
                            autoCorrect={'false'}
                            className='input'
                            value={this.props.content}
                            onChange={e => this.props.onChangedContent(e.target.value)}>
                        </textarea>
                    </div>
                </div>
            </section>
        );
    }
}
