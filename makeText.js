/** Command-line tool to generate Markov text. */

const markov = require('./markov');
const fs = require('fs');
const process = require('process');
const axios = require('axios');

function generateText(text) {
    let mm = new markov.MarkovMachine(text);
    console.log(mm.makeText())
}

function generateFromFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            console.error(`Cannot read file: ${path}: ${err}`);
            process.exit(1);
        } else {
            generateText(data);
        }
    });
}


async function generateFromURL(path) {
    let res;
    try {
        res = await axios.get(path);
    } catch (err) {
        console.error(`Cannot read URL: ${path}: ${err}`);
        process.exit(1);
    }
    generateText(res.data);
}



let [method, path] = process.argv.slice(2);

if (method === 'file') {
    generateFromFile(path);
}
else if (method === 'url') {
    generateFromURL(path);
}
else {
    console.error(`Unidentified method: ${method}`);
    process.exit(1);
}