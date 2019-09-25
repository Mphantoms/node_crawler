process.on('message', (msg) => {
    console.log('Received message from master:' + msg);
});