const markov = require('./markov');
const fs = require('fs');
const process = require('process');
const axios = require('axios');

jest.mock('axios');

describe('generateText', () => {
    test('generates text without error', () => {
        const text = 'the cat in the hat';
        const generateText = jest.spyOn(markov.MarkovMachine.prototype, 'makeText');
        generateText.mockReturnValue('the cat in the hat');
        expect(() => generateText(text)).not.toThrow();
    });
});

describe('generateFromFile', () => {
    test('reads file and generates text without error', (done) => {
        const fileData = 'the cat in the hat';
        const readFileSync = jest.spyOn(fs, 'readFile');
        readFileSync.mockImplementation((path, options, callback) => {
            callback(null, fileData);
        });
        const generateText = jest.spyOn(markov.MarkovMachine.prototype, 'makeText');
        generateText.mockReturnValue(fileData);
        generateFromFile('somefile.txt');
        setImmediate(() => {
            expect(readFileSync).toHaveBeenCalledWith('somefile.txt', 'utf8', expect.any(Function));
            expect(generateText).toHaveBeenCalledWith(fileData);
            done();
        });
    });

    test('handles file read error', (done) => {
        const error = new Error('file not found');
        const readFileSync = jest.spyOn(fs, 'readFile');
        readFileSync.mockImplementation((path, options, callback) => {
            callback(error);
        });
        const consoleError = jest.spyOn(console, 'error');
        consoleError.mockImplementation(() => { });
        generateFromFile('nonexistentfile.txt');
        setImmediate(() => {
            expect(readFileSync).toHaveBeenCalledWith('nonexistentfile.txt', 'utf8', expect.any(Function));
            expect(consoleError).toHaveBeenCalledWith(`Cannot read file: nonexistentfile.txt: ${error}`);
            expect(process.exit).toHaveBeenCalledWith(1);
            done();
        });
    });
});

describe('generateFromURL', () => {
    test('reads URL and generates text without error', async () => {
        const urlData = 'the cat in the hat';
        axios.get.mockResolvedValue({ data: urlData });
        const generateText = jest.spyOn(markov.MarkovMachine.prototype, 'makeText');
        generateText.mockReturnValue(urlData);
        await generateFromURL('http://example.com');
        expect(axios.get).toHaveBeenCalledWith('http://example.com');
        expect(generateText).toHaveBeenCalledWith(urlData);
    });

    test('handles URL read error', async () => {
        const error = new Error('not found');
        axios.get.mockRejectedValue(error);
        const consoleError = jest.spyOn(console, 'error');
        consoleError.mockImplementation(() => { });
        await generateFromURL('http://example.com/nonexistent');
        expect(axios.get).toHaveBeenCalledWith('http://example.com/nonexistent');
        expect(consoleError).toHaveBeenCalledWith(`Cannot read URL: http://example.com/nonexistent: ${error}`);
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});