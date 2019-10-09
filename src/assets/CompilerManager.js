import { OPERATIONS } from './globals';



export default class CompilerManager {

    constructor() {
        this.variables = [];
        this.memory = [];
        this.labels = [];
        this.currentPos = 0;
    }



    handleParse(editor) {
        let isData = false;
        let isCode = false;
        let isHalted = false;

        let lines = editor.split('\n');
        lines = lines.filter(item => item.length !== 0);

        for (let i = 0; i < lines.length; i++) {

            let cleanLine = this.removeWhiteSpaces(lines[i]);


            if (cleanLine[0].startsWith('//')) { continue; }
            if (cleanLine[0] === '.data')    { isData = true;  continue; }
            if (cleanLine[0] === '.enddata') { isData = false; continue; }
            if (cleanLine[0] === '.code')    { isCode = true;  continue; }
            if (cleanLine[0] === '.endcode') { isCode = false; continue; }


            if (isData) {
                // Variable name
                if (cleanLine[0].match(/[A-z]/g) && cleanLine[0] !== 'DB' &&
                    cleanLine[0].endsWith(':') && !cleanLine[0].startsWith('#')) {

                    // Removing : from the name
                    cleanLine[0] = cleanLine[0].slice(0, (cleanLine[0].length - 1));
                } else throw "VARIABLE NAME NOT FOUND";


                // Variable Init
                if (cleanLine[1] === 'DB') {

                    // Check if position is set
                    let pos = null;
                    if (cleanLine[2].startsWith('#')) {
                        // Removing # and , from position
                        pos = cleanLine[2].slice(1, (cleanLine[2].length - 1));
                    } else throw "VARIABLE POSITION NOT FOUND";


                    // Check if value is set
                    let val = null;
                    if (cleanLine[3].startsWith('#')) {
                        val = cleanLine[3];
                    } else {
                        let temp = cleanLine[3];
                        if (temp.match(/[A-z]/g) && this.variables[temp] !== null && this.variables[temp] !== undefined) {
                            val = this.variables[temp].value;
                        }
                        else if (this.memory[temp] !== null && this.memory[temp] !== undefined) {
                            val = this.memory[temp].value;
                        }
                    }
                    if (val === null) { throw "VARIABLE VALUE NOT FOUND" }


                    let variable = {
                        name: null,
                        value: null,
                        position: null
                    }

                    variable.name = cleanLine[0];
                    variable.position = pos;
                    variable.value = val;

                    this.variables[cleanLine[0]] = variable;


                    let slot = {
                        command: null,
                        value: null,
                    }

                    slot.command = 'VARIABLE';
                    slot.value = val;

                    this.memory[pos] = slot;
                }
                else continue;
            }
            else if (isCode) {
                // Test if position is already occupied
                if (this.memory[this.currentPos] !== undefined) throw "MEMORY ADDRESS NOT EMPTY"

                // Check if it has a label
                let offset = 0;
                if (cleanLine[0].match(/[A-z]/g) && cleanLine[0].endsWith(':')) {
                    // Removing : from the name
                    cleanLine[0] = cleanLine[0].slice(0, (cleanLine[0].length - 1));

                    this.labels[cleanLine[0]] = this.currentPos;
                    offset = 1;
                }

                // CHECK IF IT HALTS
                if (cleanLine[0 + offset] === 'HALT') {

                    this.memory[this.currentPos] = { command: 'OPERATION', value: 116};
                    isHalted = true;

                } else if (!isHalted) {

                    // Check if it is a valid operation
                    let operationIndex = OPERATIONS.findIndex((item) => item.name === cleanLine[0 + offset]);
                    if (operationIndex !== -1) {
                        let slot = {
                            command: null,
                            value: null,
                        }

                        slot.command = 'OPERATION';
                        slot.value = OPERATIONS[operationIndex].value;

                        this.memory[this.currentPos] = slot;
                        this.currentPos++;

                        // Check if it needs a second argument
                        if (slot.value >= 100 && slot.value < 119) {
                            if (this.memory[this.currentPos] !== undefined) throw "SEQUENTIAL MEMORY ADDRESS NOT EMPTY";

                            let val = null;
                            if (cleanLine[1 + offset].startsWith('#')) {
                                // Direct Value
                                val = cleanLine[1 + offset];
                            }
                            else if (cleanLine[1 + offset].match(/[A-z]/g)) {
                                //console.log(cleanLine[1 + offset]);
                                if (cleanLine[1 + offset].endsWith(',i')) {
                                    let cleanName = cleanLine[1 + offset].slice(0, cleanLine[1 + offset].length - 2);
                                    let tempVariable = this.variables[cleanName];

                                    if (tempVariable !== undefined) {
                                        if (this.memory[tempVariable.position] !== undefined) {
                                            val = this.memory[tempVariable.position].value;
                                        } else {
                                            throw "POINTER REFERENCES AN EMPTY VALUE";
                                        }
                                    } else if (!cleanName.startsWith('#')) {
                                        if (this.memory[cleanName] !== undefined) {
                                            val = this.memory[cleanName].value;
                                        } else {
                                            throw "POINTER REFERENCES AN EMPTY VALUE";
                                        }
                                    } else {
                                        throw "UNRECOGNIZABLE LABEL";
                                    }
                                }
                                else {
                                    if (this.variables[cleanLine[1 + offset]] !== undefined) {
                                        val = this.variables[cleanLine[1 + offset]].position;
                                    } else if (cleanLine[1 + offset].match(/[A-z]/g) && !cleanLine[1 + offset].startsWith('#') && !cleanLine[1 + offset].endsWith(':')) {
                                        val = cleanLine[1 + offset];
                                    } else {
                                        throw "UNRECOGNIZABLE LABEL";
                                    }
                                }
                            }
                            else if (cleanLine[1 + offset].match(/^\d+$/)){
                                if (this.memory[cleanLine[1 + offset]] !== undefined) {
                                    val = cleanLine[1 + offset];
                                } else {
                                    throw "MEMORY ADDRESS IS REFERRING TO EMPTY SLOT";
                                }
                            } else {
                                throw "UNRECOGNIZABLE VALUE";
                            }


                            let slot = {
                                command: null,
                                value: null,
                            }

                            slot.command = 'OPERABLE';
                            slot.value = val;

                            this.memory[this.currentPos] = slot;
                            this.currentPos++;
                        }


                    } else throw "UNRECOGNIZABLE OPERATION";

                } else {
                    throw "UNREACHABLE CODE";
                }
            }
        }

        for (let j = 0; j < this.memory.length; j++) {
            if (this.memory[j] && typeof this.memory[1] !== 'number' &&
                typeof this.memory[j].value !== 'number' && this.memory[j].value.match(/[A-z]/g) &&
                !this.memory[j].value.startsWith('/') && !this.memory[j].value.endsWith('/')) {

                this.memory[j].value = this.labels[this.memory[j].value];
            }
        }
        //console.log(this.memory);

        return {
            variables: this.variables,
            memory: this.memory
        }
    }

    removeWhiteSpaces(line) {
        let cleanLine = line.split(' ');

        cleanLine = cleanLine.map(item => {
            if (item !== '') return item.trim();
            else return null;
        });

        cleanLine = cleanLine.filter(item => item !== null);

        return cleanLine;
    }

    handleReset() {
        this.variables = [];
        this.memory = [];
        this.labels = [];
        this.currentPos = 0;
    }
}
