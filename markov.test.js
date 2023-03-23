const { MarkovMachine } = require('./markov');

describe('MarkovMachine', () => {
    test('makeChains creates chains correctly', () => {
        const machine = new MarkovMachine('the cat in the hat');
        expect(machine.chains.get('the')).toEqual(['cat', 'hat']);
        expect(machine.chains.get('cat')).toEqual(['in']);
        expect(machine.chains.get('in')).toEqual(['the']);
        expect(machine.chains.get('hat')).toEqual([null]);
    });

    test('makeText generates text of the expected length', () => {
        const machine = new MarkovMachine('the cat in the hat');
        const output = machine.makeText(5);
        expect(output.split(' ')).toHaveLength(5);
    });
    test('makeText generates text of the expected format', () => {
        const machine = new MarkovMachine('the cat in the hat');
        const output = machine.makeText(5);
        expect(typeof output).toBe('string');
        expect(output.trim().split(' ')).toHaveLength(5);
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