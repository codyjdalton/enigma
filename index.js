class Enigma {

    constructor(
        rotorSettingsInput = [0, 0, 0],
        plugboardSettingsInput = '') {

        // 1. prepare rotors
        this.rotorAlphabet = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        this.reflector = this.rotorAlphabet[ this.rotorAlphabet.length - 1 ].split('').reverse().join('');
        this.rotorSettings = rotorSettingsInput;

        // 2. prepare plugboard
        this.plugboardSettings = plugboardSettingsInput;
        this.plugboard = {};
        this.setPlugboard();
    }

    setPlugboard() {
        const pairs = this.plugboardSettings.split(' ');
        pairs.forEach(
            pair => {
                const first = pair[0].toUpperCase();
                const second = pair[1].toUpperCase();

                this.plugboard[first] = second;
                this.plugboard[second] = first;
            }
        );

        console.log(this.plugboard)
    }

    encrypt(text) {

        const encrypted = text.split(' ').join('').toUpperCase();
        const parts = encrypted.split('');

        const result = parts.map(
            (part) => {

                part = this.applyPlugboard(part);

                // increment rotor setting
                this.incrementRotor();

                // return offset character
                return this.applyPlugboard( this.getRotorCharacter(part) );
            }
        ).join('');

        return result;
    }

    getAdjustedIndex(position, rotorIdx, inverse = 1) {
        const offset = this.rotorSettings[rotorIdx];
        const corrected = position + (offset * inverse);
        let result =  corrected < 26 ? corrected : corrected - 26;

        result = result > -1 ? result : result + 26;

        return result;
    }

    getRotorCharacter(letter) {

        let lastChar;
        let newIdx = this.rotorAlphabet[0].indexOf(letter);
        let i = 0;
        
        while(i < this.rotorAlphabet.length) {
            newIdx = this.getAdjustedIndex(newIdx, i);
            lastChar = this.rotorAlphabet[i][newIdx];
            i++;
        }

        // now work backwards... reflect last value...  
        i = this.rotorAlphabet.length - 1;
        newIdx = this.reflector.indexOf(lastChar);

        while(i > -1) {
            newIdx = this.getAdjustedIndex(newIdx, i, -1);
            lastChar = this.rotorAlphabet[i][newIdx];
            i--;
        }

        return lastChar;
    }

    applyPlugboard(character) {

        let result = this.plugboard[character];

        return result ? result : character;
    }

    incrementRotor() {

       let currentRotor = 0;
       let done = false;

       while(!done) {
        if(this.rotorSettings[currentRotor] === 25) {
            this.rotorSettings[currentRotor] = 0;

            if(this.rotorSettings[currentRotor + 1] !== undefined) {
                currentRotor = currentRotor + 1;
            } else {
                currentRotor = 0;
                done = true;
            }
        } else {
            this.rotorSettings[currentRotor] = this.rotorSettings[currentRotor] + 1;
            done = true;
        }
       }
    }
}

const aEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');
const bEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');

console.log(aEnigma.encrypt('HITHISISANENCRYPTEDSENTENCE'))
console.log(bEnigma.encrypt('FLYANJAHZGWMQNZQOJYRUGBZJGG'))