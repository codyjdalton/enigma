const fs = require('fs');
const path = require('path');

const { Enigma } = require('./enigma');

class EnigmaCracker {

    constructor() {
        this.rotorOptions = this.getAllRotorSettings();
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
        .slice(0, 3);
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