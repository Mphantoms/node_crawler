const childProcess = require('child_process');
const cpuNum = require('os').cpus().length;

for (let i = 0; i < cpuNum; ++i) {
  childProcess.fork('./worker.js').send(i);
}

console.log('Master: xxxx');