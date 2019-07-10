#!/usr/bin/env node

if (process.env.NO_VERIFY === "1") {
	process.exit(0)
}

const { spawn } = require('child_process');

let proc = spawn("yarn", ["run", "check-style"]);

proc.on('close', (code) => {
	process.exit(code)
})

proc.stdout.on('data', (data) => {
	console.log(`${data}`);
});

proc.stderr.on('data', (data) => {
	console.error(`${data}`);
});
