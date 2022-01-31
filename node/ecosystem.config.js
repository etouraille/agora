module.exports = {
  apps : [{
    name: 'node',
    script: 'serve.js',
    watch: '.',
    args: '-f -i 1',
    env_development: {
      ENV: 'development'
    },
    env: {
      ENV: 'production'
    }
  }]
};
