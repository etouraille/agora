module.exports = {
  apps : [{
    name: 'socket',
    script: 'socket.js',
    watch: '.',
    instances : "max",
    exec_mode : "cluster"
  }]
};
