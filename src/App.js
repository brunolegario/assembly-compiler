import React from 'react';

import CodeEditor from './components/CodeEditor';
import Compiler from './components/Compiler';

import './css/app.scss';



let INITIAL_STRING =
`.data
RESULT: DB #30, #0
VEZES: DB #31, #3
.enddata

.code
INICIO: LD VEZES
JZ FIM
SUB #1
ST VEZES
LD RESULT
ADD #2
ST RESULT
JMP INICIO
FIM: HALT
.endcode`;

// `.data
// INICIO: DB #127, #999
// FINAL: DB #128, #100
// .enddata

// .code
// START: LD INICIO
// LD #444
// ST 127
// ST FINAL
// HALT
// .endcode`;



export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editor: INITIAL_STRING,
        }
    }



    render() {
        return (
            <main className='main'>
                <aside className='flex column' style={{ width: '25%', height: '100%', padding: '1.5rem' }}>
                    <CodeEditor
                        content={this.state.editor}
                        onChangedContent={(content) => this.setState({ editor: content })}
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
