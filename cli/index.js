"use strict";

var notifier = [];
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        for (var n = 0; n < notifier.length; n++) {
            notifier[n](chunk);
        }
    }
});

if (process.argv.length < 3) {
    process.stdout.write('Enter command: ');
    notifier.push(startCommand);
}
else {
    startCommand(process.argv[2]);
}

function startCommand(cmdName) {
    if (!cmdName) {
        process.stdout.write('No command given.');
        process.exit(1);
        return;
    }

    cmdName = cmdName.replace(/\s*[\r\n]/gm, '');
    if (cmdName === 'help' || cmdName === '-h') {
        showHelp();
        return;
    }

    require('./' + cmdName)(process.argv.slice(3));
}

function showHelp() {
    console.log('node cli <command-name>');
    console.log('node node_modules/annotation-api/cli <command-name>');
    console.log('---------------------');
    console.log('available commands:');
    console.log('doc-builder    - generates a documentation based on your api');
    console.log('help [-h]      - help and list of available commands');
    console.log('');
    process.exit(0);
}
