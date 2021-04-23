class Enigma {

    constructor() {
        this.rotorAlphabet = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        this.reflector = this.rotorAlphabet[ this.rotorAlphabet.length - 1 ].split('').reverse().join('');
        this.roterSettings = [ 1, 0, 0];
    }

    encrypt(text) {

        const encrypted = text.split(' ').join('').toUpperCase();
        const parts = encrypted.split('');

        const result = parts.map(
            (part) => {

                // increment rotor setting
                this.incrementRotor();

                // return offset character
                return this.getRotorCharacter(part);
            }
        ).join('');

        return result;
    }

    getAdjustedIndex(position, rotorIdx, inverse = 1) {
        const offset = this.roterSettings[rotorIdx];
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
            console.log(newIdx);
            newIdx = this.getAdjustedIndex(newIdx, i);
            lastChar = this.rotorAlphabet[i][newIdx];
            i++;
        }

        // now work backwards... reflect last value...  
        i = this.rotorAlphabet.length - 1;
        newIdx = this.reflector.indexOf(lastChar);

        while(i > -1) {
            newIdx = this.getAdjustedIndex(newIdx, i, -1);
            console.log(newIdx);
            lastChar = this.rotorAlphabet[i][newIdx];
            i--;
        }

        return  lastChar;
    }

    incrementRotor() {
       this.roterSettings[0] = this.roterSettings[0] + 1;
    }
}

const anEnigma = new Enigma();

console.log(anEnigma.encrypt('CODE'))