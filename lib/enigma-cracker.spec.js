const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const { Enigma } = require('./enigma');
const { EnigmaCracker } = require('./enigma-cracker');

describe('Class: EnigmaCracker', () => {

    it('should correctly decrypt enigma text', (done) => {

        fs.readFile(path.resolve(__dirname, 'text/secret.txt'), 'utf8', (err, txt) => {

            // encrypt it
            const anEnigma = new Enigma([ 19, 12, 25 ], 'qw er ty ui op as df gh jk zx');
            const encryptedText = anEnigma.encrypt(txt);

            // crack it...
            const aCracker = new EnigmaCracker();
            const result = aCracker.decrypt(encryptedText);
            const sanitizedTxt = aCracker.sanitizeText(txt);
        
            expect(result).equals(sanitizedTxt);
            done();
        });
    }).timeout(120000);
});