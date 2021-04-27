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
        this.reflector = 'ABCDEFGDIJKGMKMIEBFTCVVJAT';
        this.rotorSettings = [].concat(rotorSettingsInput);

        // 2. prepare plugboard
        this.plugboardSettings = plugboardSettingsInput + '';
        this.plugboard = {};
        this.setPlugboard();
    }

    sanitizeText(text) {
        return text.replace(/[^a-z0-9]/gi,'').split(' ').join('').toUpperCase();
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

    getRotorCharacter(letter) {

        function getPositions(str, substring) {

            const matches = [];

            str.split('').forEach(
                (char, idx) => {
                    if(char === substring) {
                        matches.push(idx);
                    }
                }
            );

            return matches;
        }

        const adjustedAlphabets = this.rotorAlphabet.map(
            (alpha, idx) => {
                return [
                    this.getAdjustedAlphabet(alpha, this.rotorSettings[idx]),
                    this.getAdjustedAlphabet(this.standardAlphabet, this.rotorSettings[idx])
                ];
            }
        );

        let alphaPosition = this.standardAlphabet.indexOf(letter);
        let focusedRotorIdx = 0;
        let newCharacter;

        while(focusedRotorIdx < this.rotorAlphabet.length) {

            newCharacter = adjustedAlphabets[focusedRotorIdx][0][alphaPosition];
            alphaPosition = adjustedAlphabets[focusedRotorIdx][1].indexOf(newCharacter);

            focusedRotorIdx++;
        }

        // get reflected position
        newCharacter = this.reflector[alphaPosition];
        let reflectedPositions = getPositions(this.reflector, newCharacter);
        alphaPosition = reflectedPositions[0] != alphaPosition ? reflectedPositions[0] : reflectedPositions[1];

        // back the rotor focus up one...
        focusedRotorIdx = focusedRotorIdx - 1;

        while(focusedRotorIdx > -1) {

            newCharacter = adjustedAlphabets[focusedRotorIdx][1][alphaPosition];
            alphaPosition =  adjustedAlphabets[focusedRotorIdx][0].indexOf(newCharacter);

            focusedRotorIdx--;
        }

        // set final new character
        newCharacter = this.standardAlphabet[alphaPosition];

        return newCharacter;
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