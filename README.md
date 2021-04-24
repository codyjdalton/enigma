[![Build Status](https://travis-ci.org/codyjdalton/enigma.svg?branch=main)](https://travis-ci.org/codyjdalton/enigma) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/enigma/badge.svg?branch=main)](https://coveralls.io/github/codyjdalton/enigma?branch=main)

# Enigma

Simple implemention of an Enigma machine

## Getting Started
```
npm install; 
npm test;
```
## Rotor Wiring
By far the most complex part of the implementation. Our example uses 3 rotors but could easily support as many as needed if alphabets were provided.

### Requirements
1) The inverse of a character must always be reflected back to the same original character. Example: With a given rotor setting, A -> G then G -> A. This is so the machine can be used for both encryption and decryption.
2) The first rotor must move quickly and each subsequent rotor must move 1/25 of the previous rotor. So given no settings, [ 1, 0, 0 ] would be the first move until it reached [ 25, 0, 0 ] at which point it would switch to [ 0, 1, 0 ].
3) If the last rotor reaches 25, all rotors must reset back to 0. This makes the machine infinitely usable.

![Rotor Diagram](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Enigma-action.svg/800px-Enigma-action.svg.png)

## Plugboard Wiring

Very simple swapping of two characters. Provided to the class in a string like 'ad cm ey kp'. This would switch A -> D and D -> A respectively.
![Plugboard Diagram](https://upload.wikimedia.org/wikipedia/commons/5/53/Enigma_wiring_kleur.svg)

