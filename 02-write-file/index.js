const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const file = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
stdout.write('Hello!\n');
stdin.on('data', (text) => {
    if(text.toString().trim() === 'exit') {
        exit();
    }
    file.write(text);
})
process.on('exit', () => stdout.write('\nGoodbye!'));
process.on('SIGINT', exit);

