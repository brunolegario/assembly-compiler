import React, {Fragment} from 'react';

import _ from 'lodash';

import CompilerManager from '../assets/CompilerManager';
import Flow from './Flow';
import Memory from './Memory';
import Control from './Control';
import Canvas from './Canvas';

import './Compiler.scss';



export default class Compiler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            variables: [],
            memory: Array.from({ length: 256 }).map((u, i) => i),

            error: '',

            control: {
                ac: '',
                ac2: '',
                ac3: '',

                x: '',
                y: '',

                pc: '',

                z: '',
                n: '',
                p: ''
            }
        }

        this.compiler = new CompilerManager();
    }



    handleReadEditor = () => {
        try {
            let result = this.compiler.handleParse(this.props.editor);

            this.setState({
                variables: result.variables,
                memory: result.memory
            });
        } catch (err) {
            console.log(err);
            this.setState({ error: err });
        }
    }

    handleStart = () => {
        this.handleUpdateControl('pc', 0);
    }

    handleReset = async () => {
        try {
            await this.compiler.handleReset();

            this.setState({
                variables: [],
                memory: Array.from({ length: 256 }).map((u, i) => i),

                error: '',

                control: {
                    ac: '',
                    ac2: '',
                    ac3: '',

                    x: '',
                    y: '',

                    pc: '',

                    z: '',
                    n: '',
                    p: ''
                }
            })
        } catch (err) {
            console.log(err);
            this.setState({ error: err });
        }
    }

    handleUpdateControl = (name, value) => {
        let control = this.state.control;
        control[name] = value;

        this.setState({ control: control });
    }

    handleAdvanceProgram = (isAll) => {
        //console.log(isAll);

        let control = _.cloneDeep(this.state.control);
        let memory = _.cloneDeep(this.state.memory);

        let currentMemory = this.state.memory[this.state.control.pc].value;
        //console.log(currentMemory);


        let nextElement = null;
        // Load
        if (currentMemory >= 100 && currentMemory <= 102) {
            // Clean the value
            nextElement = memory[control.pc + 1].value;
            if (typeof nextElement === 'string' && nextElement.startsWith('#')) {
                nextElement = nextElement.slice(1, nextElement.length);
            } else {
                nextElement = memory[nextElement].value;
            }

            // Update AC values
            switch (currentMemory) {
                case 100 :
                    control.ac = nextElement;
                    break;
                case 101 :
                    control.ac2 = nextElement;
                    break;
                case 102 :
                    control.ac3 = nextElement;
                    break;
                default :
                    break;
            }

            // Update other controllers
            if (nextElement < 0) {
                control.n = 1;
                control.z = 0;
                control.p = 0;
            } else if (nextElement === 0) {
                control.n = 0;
                control.z = 1;
                control.p = 0;
            } else if (nextElement > 0) {
                control.n = 0;
                control.z = 0;
                control.p = 1;
            }

            control.pc += 2;
        }
        // Set
        else if (currentMemory >= 103 && currentMemory <= 105) {
            // Clean the value
            nextElement = memory[control.pc + 1].value;

            // Update values
            if (typeof nextElement === 'number' || !nextElement.startsWith('#')) {
                switch (currentMemory) {
                    case 103 :
                        memory[nextElement] = control.ac;
                        break;
                    case 104 :
                        memory[nextElement] = control.ac2;
                        break;
                    case 105 :
                        memory[nextElement] = control.ac3;
                        break;
                    default:
                        break;
                }
            }

            control.pc += 2;
        }
        // Math
        else if (currentMemory >= 106 && currentMemory <= 110) {
            // Clean the value
            nextElement = memory[control.pc + 1].value;
            if (typeof nextElement === 'string' && nextElement.startsWith('#') && currentMemory !== 108) {
                nextElement = nextElement.slice(1, nextElement.length);
            } else {
                nextElement = memory[nextElement].value;
            }

            // Update values
            switch (currentMemory) {
                case 106 :
                    control.ac -= nextElement;
                    break;
                case 107 :
                    control.ac += nextElement;
                    break;
                case 108 :
                    memory[nextElement] = Math.random() * (control.ac2 - control.ac1) + control.ac1
                    break;
                case 109 :
                    control.ac = Math.cos(nextElement / 180 * Math.PI) * control.ac2;
                    break;
                case 110 :
                    control.ac = Math.sin(nextElement / 180 * Math.PI) * control.ac2;
                    break;
                default:
                    break;
            }

            // Update other controllers
            if (currentMemory !== 108) {
                if (control.ac < 0) {
                    control.n = 1;
                    control.z = 0;
                    control.p = 0;
                } else if (control.ac === 0) {
                    control.n = 0;
                    control.z = 1;
                    control.p = 0;
                } else if (control.ac > 0) {
                    control.n = 0;
                    control.z = 0;
                    control.p = 1;
                }
            }

            control.pc += 2;
        }
        // Jumps
        else if (currentMemory >= 111 && currentMemory <= 115) {
            // Clean the value
            nextElement = memory[control.pc + 1].value;

            switch (currentMemory) {
                case 111 :
                    control.pc = nextElement;
                    break;
                case 112 :
                    control.pc = (control.p === 1) ? nextElement : control.pc += 2;
                    break;
                case 113 :
                    control.pc = (control.n === 1) ? nextElement : control.pc += 2;
                    break;
                case 114 :
                    control.pc = (control.z === 1) ? nextElement : control.pc += 2;
                    break;
                case 115 :
                    control.pc = (control.z === 0) ? nextElement : control.pc += 2;
                    break;
                default:
                    break;
            }
        }
        // Halt
        else if (currentMemory === 116) {
            control.pc = '';
        }
        // Print
        else if (currentMemory === 117) {
            // Clean the value
            nextElement = memory[control.pc + 1].value;
            if (typeof nextElement === 'string' && nextElement.startsWith('#')) {
                nextElement = nextElement.slice(1, nextElement.length);
            } else {
                nextElement = memory[nextElement].value;
            }

            console.log(nextElement);
            control.pc += 2;
        }
        // Input
        else if (currentMemory === 118) {
            control.pc += 2;
        }
        // Drawing
        else if (currentMemory > 118) {
            control.pc += 1;
        }


        this.setState({
            memory: memory,
            control: control
        });
    }



    render() {
        return (
            <Fragment>
                <div style={{ width: '100%', height: '50%', marginBottom: '2%' }}>
                    <Memory
                        content={this.state.memory}
                        control={this.state.control}
                    />
                </div>
                <div className='flex row' style={{ width: '100%', height: '48%' }}>
                    <div style={{ width: '30%', position: 'relative', justifyContent: 'space-between' }}>
                        <Control
                            control={this.state.control}
                            onUpdateControl={this.handleUpdateControl}
                        />
                        <Flow
                            editor={this.props.editor}
                            memory={this.state.memory}
                            control={this.state.control}
                            onRead={this.handleReadEditor}
                            onStart={this.handleStart}
                            onReset={this.handleReset}
                            onUpdateControl={this.handleUpdateControl}
                            onAdvanceProgram={this.handleAdvanceProgram}
                        />
                    </div>
                    <div style={{ width: '70%' }}>
                        <Canvas />
                    </div>
                </div>
            </Fragment>
        );
    }


}
