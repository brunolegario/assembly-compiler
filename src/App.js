import React from 'react';

import CodeEditor from './components/CodeEditor';
import Compiler from './components/Compiler';

import { EX1, EX2, EX3 } from './assets/exercises';

import './css/app.scss';


// `.data
// RESULT: DB #30, #0
// VEZES: DB #31, #3
// .enddata

// .code
// INICIO: LD VEZES
// JZ FIM
// SUB #1
// ST VEZES
// LD RESULT
// ADD #2
// ST RESULT
// JMP INICIO
// FIM: HALT
// .endcode`;



export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editor: EX3,
        }
    }



    handleChangeCode = (option) => {
        switch (option) {
            case 1 :
                this.setState({ editor: EX1 });
                break;
            case 2 :
                this.setState({ editor: EX2 });
                break;
            case 3 :
                this.setState({ editor: EX3 });
                break;
            default :
                break;
        }
    }



    render() {
        return (
            <main className='main'>
                <aside className='flex column' style={{ width: '25%', height: '100%', padding: '1.5rem' }}>
                    <CodeEditor
                        content={this.state.editor}
                        onChangedContent={(content) => this.setState({ editor: content })}
                        onChangeCode={this.handleChangeCode}
                    />
                </aside>
                <section className='flex column' style={{ width: '75%', height: '100%', padding: '1.5rem' }}>
                    <Compiler
                        editor={this.state.editor}
                    />
                </section>
            </main>
        );
    }
}
