import React from 'react';

import CodeEditor from './components/CodeEditor';
import Compiler from './components/Compiler';

import './css/app.scss';



let INITIAL_STRING =
`.data
ZERO: DB #144, #0
COLOR: DB #145, #255
WIDTH: DB #146, #20
HEIGHT: DB #147, #10
Y: DB #148, #0
X: DB #149, #0
.enddata

.code
START: LD Y
SUB HEIGHT
JZ END
DRAW: LD X
LD2 Y
POS
LD ZERO
LD2 ZERO
LD3 COLOR
PXL
LD X
SUB WIDTH
JZ NLINE
LD X
ADD #1
ST X
JMP DRAW
NLINE: LD ZERO
ST X
LD Y
ADD #1
ST Y
JMP START
END: HALT
.endcode`;

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
