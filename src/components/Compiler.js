import React, {Fragment} from 'react';

import _ from 'lodash';

import CompilerManager from '../assets/CompilerManager';
import Flow from './Flow';
import Memory from './Memory';
import Control from './Control';

import './Compiler.scss';



export default class Compiler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,

            width: 100,
            height: 100,

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
            },
        }

        this.compiler = new CompilerManager();

        this.canvas = React.createRef();
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
        let context = this.canvas.current.getContext('2d');
        context.clearRect(0, 0, this.state.width, this.state.height);

        this.handleUpdateControl('pc', 0);
    }

    handleReset = async () => {
        try {
            await this.compiler.handleReset();

            let context = this.canvas.current.getContext('2d');
            context.clearRect(0, 0, this.state.width, this.state.height);

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

    handleAdvanceProgramStep = async (callback = null) => {
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
            //console.log(memory[control.pc + 1].value);
            if (typeof nextElement === 'string' && nextElement.startsWith('#')) {
                nextElement = nextElement.slice(1, nextElement.length);
            } else if (memory[nextElement].value.startsWith('#')) {
                nextElement = memory[nextElement].value.slice(1, memory[nextElement].value.length);
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
            if (parseInt(nextElement) < 0) {
                control.n = 1;
                control.z = 0;
                control.p = 0;
            } else if (parseInt(nextElement) === 0) {
                control.n = 0;
                control.z = 1;
                control.p = 0;
            } else if (parseInt(nextElement) > 0) {
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
                        memory[nextElement].value = '#' + control.ac;
                        break;
                    case 104 :
                        memory[nextElement].value = '#' + control.ac2;
                        break;
                    case 105 :
                        memory[nextElement].value = '#' + control.ac3;
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
            if (currentMemory !== 108) {
                if (typeof nextElement === 'string' && nextElement.startsWith('#')) {
                    nextElement = nextElement.slice(1, nextElement.length);
                } else if (memory[nextElement].value.startsWith('#')) {
                    nextElement = memory[nextElement].value.slice(1, memory[nextElement].value.length);
                } else {
                    nextElement = memory[nextElement].value;
                }
            }


            // Update values
            switch (currentMemory) {
                case 106 :
                    control.ac = parseInt(control.ac) - parseInt(nextElement);
                    break;
                case 107 :
                    control.ac = parseInt(control.ac) + parseInt(nextElement);
                    break;
                case 108 :
                    let rand = Math.random() * (parseInt(control.ac2) - parseInt(control.ac)) + parseInt(control.ac);

                    memory[nextElement].value = '#' + parseInt(rand);
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
        else if (currentMemory === 119) {
            control.x = control.ac;
            control.y = control.ac2;
            control.pc += 1;
        } else if (currentMemory === 120) {
            let canvas = this.canvas.current;
            let context = canvas.getContext('2d');

            context.beginPath();
            context.fillStyle = `rgba(${control.ac},${control.ac2}, ${control.ac3}, 255)`;
            context.fillRect(control.x, control.y, 1, 1);

            control.pc += 1;
        }


        await this.setState({
            memory: memory,
            control: control
        }, () => console.log('STEP FINISHED'));
    }

    handleAdvanceProgramAll = () => {
        let that = this;

        async function loop() {
            while(that.state.control.pc !== '' && that.state.memory[that.state.control.pc] !== undefined) {
                await that.handleAdvanceProgramStep();
            }
        }

        this.setState({ loading: true }, async () => {
            console.log(this.state.loading);
            loop().then(() => this.setState({ loading: false }, () => console.log(this.state.loading)));
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
                            onAdvanceProgramStep={this.handleAdvanceProgramStep}
                            onAdvanceProgramAll={this.handleAdvanceProgramAll}
                        />
                    </div>
                    <div className='canvas container' style={{ width: '55%' }}>
                        <label className='label'>CANVAS</label>
                        <canvas
                            width={this.state.width} height={this.state.height}
                            ref={this.canvas}
                            className='canvas' />
                    </div>
                    <div className='subtitles container' style={{ width: '15%', height: '100%' }}>
                        <label className='label'>LEGENDA</label>
                        <div className='content'>
                            <p>
                                <span className='operation'>999</span> - INSTRUÇÃO
                            </p>
                            <p>
                                <span className='value'>999</span> - VALOR
                            </p>
                            <hr />
                            <p>
                                <span className='operation'>100</span> - Load
                            </p>
                            <p>
                                <span className='operation'>101</span> - Load 2
                            </p>
                            <p>
                                <span className='operation'>102</span> - Load 3
                            </p>
                            <p>
                                <span className='operation'>103</span> - Set
                            </p>
                            <p>
                                <span className='operation'>104</span> - Set 2
                            </p>
                            <p>
                                <span className='operation'>105</span> - Set 3
                            </p>
                            <p>
                                <span className='operation'>106</span> - Subtraction
                            </p>
                            <p>
                                <span className='operation'>107</span> - Addition
                            </p>
                            <p>
                                <span className='operation'>108</span> - Random
                            </p>
                            <p>
                                <span className='operation'>109</span> - Cosine
                            </p>
                            <p>
                                <span className='operation'>110</span> - Sine
                            </p>
                            <p>
                                <span className='operation'>111</span> - Jump
                            </p>
                            <p>
                                <span className='operation'>112</span> - Jump if positive
                            </p>
                            <p>
                                <span className='operation'>113</span> - Jump if negative
                            </p>
                            <p>
                                <span className='operation'>114</span> - Jump if zero
                            </p>
                            <p>
                                <span className='operation'>115</span> - Jump if non-zero
                            </p>
                            <p>
                                <span className='operation'>116</span> - Halt
                            </p>
                            <p>
                                <span className='operation'>117</span> - Print
                            </p>
                            <p>
                                <span className='operation'>118</span> - Input
                            </p>
                            <p>
                                <span className='operation'>119</span> - Position
                            </p>
                            <p>
                                <span className='operation'>120</span> - Pixel
                            </p>
                            <p>
                                <span className='operation'>121</span> - Clear
                            </p>
                        </div>
                    </div>
                </div>

                { this.state.loading ? (
                    <div className='loading-box' />
                ) : null}
            </Fragment>
        );
    }


}
