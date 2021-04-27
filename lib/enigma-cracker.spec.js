const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const { Enigma } = require('./enigma');
const { EnigmaCracker } = require('./enigma-cracker');

describe('Class: EnigmaCracker', () => {

    it('should identify the correct rotor settings', (done) => {

        const aCracker = new EnigmaCracker();
        const testRotorSetting = [ 19, 12, 25 ];

        fs.readFile(path.resolve(__dirname, 'text/secret.txt'), 'utf8', (err, txt) => {

            const anEnigma = new Enigma(testRotorSetting);
            const encryptedText = anEnigma.encrypt(txt);

            const results = aCracker.getBestRotorSettings(encryptedText);
        
            expect(results[0].rotorSetting).deep.equals(testRotorSetting);
            done();
        });
    }).timeout(60000);
});