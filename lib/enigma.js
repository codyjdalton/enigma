/**
 * Class Declaration
 */
class Enigma {

    constructor(
        rotorSettingsInput = [ 0, 0, 0 ],
        plugboardSettingsInput = '') {

        // 1. prepare rotors
        this.standardAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.rotorAlphabet = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        this.adjustedRotorAlphabet = [];
        this.rotorSettings = [].concat(rotorSettingsInput);

        // 2. prepare plugboard
        this.plugboardSettings = plugboardSettingsInput + '';
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

    getRotorCharacter(letter) {
        return letter;
    }

    applyPlugboard(character) {
        return this.plugboard[character] ? 
            this.plugboard[character] : character;
    }

    setAdjustedAlphabet() {

        // update adjusted rotor alphabet
        const getRotorAlphabetSection = (start, end) => {
            return this.rotorAlphabet[focusedRotorIdx].slice(start, end);
        };
        let focusedRotorIdx = 0;

        while(focusedRotorIdx < this.rotorAlphabet.length) {

            // set the correct rotor alphabet in adjusted alphabet given the offset
            const offset = this.rotorSettings[focusedRotorIdx];
            const end = getRotorAlphabetSection(0, offset);
            const start = getRotorAlphabetSection(offset, this.rotorAlphabet[focusedRotorIdx].length);
            
            this.adjustedRotorAlphabet[focusedRotorIdx] = start + end;

            focusedRotorIdx++;
        }
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

        this.setAdjustedAlphabet();
    }
}

module.exports = {
    Enigma
};