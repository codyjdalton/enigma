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

        const encrypted = this.sanitizeText(text);
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

    sanitizeText(text) {
        return text.replace(/[^a-z0-9]/gi,'').split(' ').join('').toUpperCase();
    }

    getRotorCharacter(letter) {

        // 1. go forward through the rotors...
        let focusedRotorIdx = 0;
        let newRotorAlphabets = [];

        let newLetter = letter + '';
        let alphaPosition = this.standardAlphabet.indexOf(letter);

        while(focusedRotorIdx < this.rotorAlphabet.length) {

            // get the adjusted alphabet
            const adjustedAlphabet = this.getAdjustedAlphabet(
                this.rotorAlphabet[focusedRotorIdx],
                this.rotorSettings[focusedRotorIdx]
            );

            // save for the trip back through
            newRotorAlphabets[focusedRotorIdx] = adjustedAlphabet;

            // get the new letter from this rotor
            newLetter = adjustedAlphabet[ alphaPosition ];
            alphaPosition = this.standardAlphabet.indexOf( newLetter ); 

            focusedRotorIdx++;
        }

        // "reflect" back through
        const reflectedRotor = newRotorAlphabets[this.rotorAlphabet.length - 1].split('').reverse().join('');
        focusedRotorIdx = this.rotorAlphabet.length - 2;

        newLetter = this.standardAlphabet[ reflectedRotor.indexOf(newLetter) ];

        while(focusedRotorIdx > -1) {

            alphaPosition = newRotorAlphabets[focusedRotorIdx].indexOf(newLetter);
            newLetter = this.standardAlphabet[alphaPosition];
            focusedRotorIdx--;
        }

        return newLetter;
    }

    applyPlugboard(character) {
        return this.plugboard[character] ? 
            this.plugboard[character] : character;
    }

    getAdjustedAlphabet(alphabet, offset) {

        const end = alphabet.slice(0, offset);
        const start = alphabet.slice(offset, alphabet.length);
        
        return start + end;
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