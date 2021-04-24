const { expect } = require('chai');
const { Enigma } = require('./enigma');

describe('Class: Enigma', () => {

    it('should correctly encrypt a string', () => {

        const encrypted = 'FLYANJAHZGWMQNZQOJYRUGBZJGG';
        const decrypted = 'hi this is an encrypted sentence';

        const aEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');

        expect(aEnigma.encrypt(decrypted)).to.equal(encrypted);
    });

    it('should correctly decrypt a string', () => {

        const encrypted = 'FLYANJAHZGWMQNZQOJYRUGBZJGG';
        const decrypted = 'HITHISISANENCRYPTEDSENTENCE';

        const aEnigma = new Enigma([ 5, 10, 9 ], 'ea bc df hi km zt xp ln');

        expect(aEnigma.encrypt(encrypted)).to.equal(decrypted);
    });

    it('should default rotor settings to [0, 0, 0]', () => {
        const aEnigma = new Enigma();

        expect(aEnigma.rotorSettings).to.deep.equal([0, 0, 0]);
    });

    it('should roll over max rotors to [0, 0, 1]', () => {
        const aEnigma = new Enigma([ 25, 25, 25 ], 'ea bc df hi km zt xp ln');

        aEnigma.encrypt('A');

        expect(aEnigma.rotorSettings).to.deep.equal([0, 0, 0]);
    });
});