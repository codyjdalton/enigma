/**
 * Class Declaration
 */
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
        this.rotorSettings = [].concat(rotorSettingsInput);

        // 2. prepare plugboard
        this.plugboardSettings = plugboardSettingsInput;
        this.plugboard = {};
        this.setPlugboard();
    }

    setPlugboard() {
        const pairs = this.plugboardSettings.split(' ');
        pairs.forEach(
            pair => {
                if(pair[0]) {
                    const first = pair[0].toUpperCase();
                    const second = pair[1].toUpperCase();
    
                    this.plugboard[first] = second;
                    this.plugboard[second] = first;
                }
            }
        );
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

    getAdjustedIndex(position, rotorIdx, inverse) {
        const offset = this.rotorSettings[rotorIdx];
        const corrected = position + (offset * inverse);
        let result =  corrected < 26 ? corrected : corrected - 26;

        result = result > -1 ? result : result + 26;

        return result;
    }

    getRotorCharacter(letter) {
        const getLastChar = (newIdx, inverseVal, i) => {
            let lastChar;
            
            while(inverseVal == 1 ? i < this.rotorAlphabet.length :
                    i > -1) {
                newIdx = this.getAdjustedIndex(newIdx, i, inverseVal);
                lastChar = this.rotorAlphabet[i][newIdx];
                inverseVal === 1 ? i++ : i--;
            }

            return lastChar;
        };
        return getLastChar(this.reflector.indexOf(
            getLastChar(this.rotorAlphabet[0].indexOf(letter), 1, 0)
        ), -1, this.rotorAlphabet.length - 1);
    }

    applyPlugboard(character) {
        return this.plugboard[character] ? 
            this.plugboard[character] : character;
    }

    incrementRotor(currentRotor = 0) {
        if(this.rotorSettings[currentRotor] === 25) {
            this.rotorSettings[currentRotor] = 0;

            if(this.rotorSettings[currentRotor + 1] !== undefined) {
                currentRotor = currentRotor + 1;
                this.incrementRotor(currentRotor);
            } else {
                currentRotor = 0;
            }
        } else {
            this.rotorSettings[currentRotor] = this.rotorSettings[currentRotor] + 1;
        }
    }
}

module.exports = {
    Enigma
};