const fs = require('fs');
const path = require('path');

const { Enigma } = require('./enigma');

class EnigmaCracker {

    constructor() {
        this.standardAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.rotorOptions = this.getAllRotorSettings();
        this.plugboardPairs = this.getAllPlugboardPairs();
    }

    decrypt(text) {
        const bestRotorSettings = this.getBestRotorSettings(text);
        const bestPlugboardSettings = this.getBestPlugboardSettings(bestRotorSettings[0].rotorSetting, text);

        return new Enigma(bestRotorSettings[0].rotorSetting, bestPlugboardSettings).encrypt(text);
    }

    getBestPlugboardSettings(rotorSetting, text) {

        let charsStr = '';
        let blacklistedCharacters = [];
        const pairs = Object.assign([], this.plugboardPairs);
        const candidates = pairs.map(
            (pair) => {
                const anEnigma = new Enigma(rotorSetting, pair);

                return {
                    pair,
                    ioc: this.calculateIoc( anEnigma.encrypt(text) )
                };
            }
        ).sort((a, b) => b.ioc - a.ioc)
        .filter(
            (candidate) => {

                // if not already used, then add to list of likely character swaps
                let parts = candidate.pair.split('');
                parts = parts.filter(
                    part => {
                        return blacklistedCharacters.indexOf(part) != -1
                    }
                );

                if(parts.length < 1) {

                    const newCharsStr = charsStr + candidate.pair + ' ';
                    // check if it improves the baseline
                    const baselineIoc = this.calculateIoc( new Enigma(rotorSetting, charsStr).encrypt(text) );
                    const candidateIoc = this.calculateIoc( new Enigma(rotorSetting, newCharsStr).encrypt(text) );

                    if(baselineIoc < candidateIoc) {

                        charsStr = newCharsStr + '';
                        parts = candidate.pair.split('');

                        blacklistedCharacters = blacklistedCharacters.concat( parts );

                        return true;
                    }
                }

                return false;
            }
        );

        return charsStr;
    }

    getBestRotorSettings(text) {
        return this.rotorOptions.map(
            rotorSetting => {
                const decryptedText = new Enigma(rotorSetting).encrypt(text)
                const iocRating = this.calculateIoc( decryptedText );
                return {
                    rotorSetting,
                    iocRating
                };
            }
        )
        .sort((a, b) => { return b.iocRating - a.iocRating } )
        .slice(0, 10);
    }

    getAllPlugboardPairs() {

        let initialIndex = 0;
        let supplementalIndex = 1;
        const pairs = [];

        while(initialIndex != this.standardAlphabet.length - 1) {
            pairs.push(
                this.standardAlphabet[initialIndex] + 
                this.standardAlphabet[supplementalIndex]
            );

            supplementalIndex++;

            if(supplementalIndex === this.standardAlphabet.length) {
                initialIndex++;
                supplementalIndex = (initialIndex + 1);
            }
        }

        return pairs;
    }

    /**
     * TODO: refactor this method to avoid hardcoding 3 rotors
     * @returns 
     */
    getAllRotorSettings() {
        const upperLimit = 25;
        const allRotors = [
            [0, 0, 0]
        ];
        let currentRotor = [0, 0, 0];

        while((currentRotor[0] + currentRotor[1] + currentRotor[2]) < (upperLimit * 3)) {

            if(currentRotor[0] == upperLimit) {
                
                currentRotor[0] = 0;

                if(currentRotor[1] == upperLimit) {
                    currentRotor[1] = 0;
                    currentRotor[2]++;
                } else {
                    currentRotor[1]++;
                }
            } else {
                currentRotor[0]++;
            }

            allRotors.push(JSON.parse(JSON.stringify(currentRotor)));
        }

        return allRotors;
    }

    sanitizeText(text) {
        return text.replace(/[^a-z0-9]/gi,'').split(' ').join('').toUpperCase();
    }
    
    calculateIoc(text) {

        const sanitized = this.sanitizeText(text);
        const parts = sanitized.split('');
        const totalChars = parts.length;

        // 1. get the distribution of each character..
        const distribution = parts.reduce(
            (result, character) => {

                if(!result[character]) {
                    result[character] = 0;
                }

                result[character]++;

                return result;
            }, 
            {}
        );

        // 2. then calculate ioc
        const distributionTotal = Object.keys(distribution).reduce(
            (result, character) => {

                const occurances = distribution[character];
                const frequency = (occurances / totalChars) * ((occurances - 1) / (totalChars - 1));

                return result + frequency;
            },
            0
        );

        return distributionTotal;
    }
}

module.exports = {
    EnigmaCracker
};