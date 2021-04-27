const { expect } = require('chai');

const { Enigma } = require('./enigma');

describe('Class: Enigma', () => {

    it('should correctly encrypt a string', () => {

        const decrypted = 'hi this is an encrypted sentence';

        const aEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');

        expect(aEnigma.encrypt(decrypted)).to.not.equal(decrypted);
    });

    it('should correctly decrypt a string', () => {

        const aEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');
        const decrypted = 'HITHISISANENCRYPTEDSENTENCE';
        const encrypted = aEnigma.encrypt(decrypted);

        const bEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');

        expect(bEnigma.encrypt(encrypted)).to.equal(decrypted);
    });

    it('should default rotor settings to [0, 0, 0]', () => {
        const aEnigma = new Enigma();

        expect(aEnigma.rotorSettings).to.deep.equal([0, 0, 0]);
    });

    it('should roll over max rotors to [0, 0, 0]', () => {
        const aEnigma = new Enigma([ 25, 25, 25 ], 'ea bc df hi km zt xp ln');

        aEnigma.encrypt('A');

        expect(aEnigma.rotorSettings).to.deep.equal([0, 0, 0]);
    });

    it('should not transform rotor settings input by consumer', () => {

        const rotorSettings = [ 25, 25, 25 ];
        const aEnigma = new Enigma(rotorSettings);

        aEnigma.encrypt('Some test text');

        expect(rotorSettings).deep.equals([ 25, 25, 25 ]);
    });

    it('should not repeat encryption given new rotor settings', () => {

        const aEnigma = new Enigma([ 5, 5, 1 ]);
        const testText = 'this is some test text';
        const result = aEnigma.encrypt(testText);
        let idx = 2;

        while(idx < 26) {
            const newEnigma = new Enigma([ 5, 5, idx ]);
            expect(newEnigma.encrypt(testText)).does.not.equal(result);
            idx++;
        }
    });
});