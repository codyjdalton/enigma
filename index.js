class Enigma {

    constructor(
        rotorSettingsInput = [0, 0, 0],
        plugboardSettingsInput = '') {
        this.rotorAlphabet = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        this.reflector = this.rotorAlphabet[ this.rotorAlphabet.length - 1 ].split('').reverse().join('');
        this.rotorSettings = rotorSettingsInput;
        this.plugboardSettings = plugboardSettingsInput;
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

const anEnigma = new Enigma([ 5, 8, 9 ]);

console.log(anEnigma.encrypt('hey this is an encrypted sentence'))