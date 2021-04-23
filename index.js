class Enigma {

    constructor() {
        this.rotorAlphabet = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        this.reflector = this.rotorAlphabet[ this.rotorAlphabet.length - 1 ].split('').reverse().join('');
        this.roterSettings = [ 0, 0, 0 ];
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

    getRotorCharacter(letter) {

        const startingCharIdx = this.rotorAlphabet[0].indexOf(letter);

        let lastChar;
        let i = 0;
        
        while(i < this.rotorAlphabet.length) {
            lastChar = this.rotorAlphabet[i][startingCharIdx];
            i++;
        }

        // get reflection of last char...
        const reflectedCharIdx = this.reflector.indexOf(lastChar);

        // now work backwards... reflect last value...  
        i = this.rotorAlphabet.length - 1;

        while(i > -1) {
            lastChar = this.rotorAlphabet[i][reflectedCharIdx];
            i--;
        }

        return  lastChar;
    }

    incrementRotor() {
       // this.roterSettings[0] = this.roterSettings[0] + 1;
    }
}

const anEnigma = new Enigma();

console.log(anEnigma.encrypt('JTJ'))