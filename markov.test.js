const { MarkovMachine } = require('./markov');

describe('MarkovMachine', () => {
    test('makeChains creates chains correctly', () => {
        const machine = new MarkovMachine('the cat in the hat');
        const chains = machine.chains;
        expect(chains.get('the')).toContain('cat', 'hat');
        expect(chains.get('cat')).toContain('in');
        expect(chains.get('in')).toContain('the');
        expect(chains.get('hat')).toContain(null);
    });


    test('makeText generates text of the expected format', () => {
        const machine = new MarkovMachine('the cat in the hat');
        const numWords = 5;
        const output = machine.makeText(numWords);
        expect(typeof output).toBe('string');
    });

    test('makeText returns an empty string for numWords = 0', () => {
        const machine = new MarkovMachine('the cat in the hat');
        const output = machine.makeText(0);
        expect(output).toBe('');
    });

    test('makeText returns an empty string if chains is empty', () => {
        const machine = new MarkovMachine('');
        const output = machine.makeText();
        expect(output).toBe('');
    });

    test('choice returns a value from the array', () => {
        const arr = [1, 2, 3, 4, 5];
        const choice = MarkovMachine.choice(arr);
        expect(arr).toContain(choice);
    });
});