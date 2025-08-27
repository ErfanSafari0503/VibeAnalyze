module.exports = {
  apps: [
    {
      name: 'vibeanalyze-backend',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/src/main.js',
      interpreter: "bun", // Bun interpreter
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
      }
    }
  ]
}
