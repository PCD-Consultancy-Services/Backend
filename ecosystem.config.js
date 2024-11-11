module.exports = {
  apps: [
    {
      name: "my-node-app", // Name of your app
      script: "src/app.js", // Script to execute
      instances: "max", // Allows the app to scale with all CPU cores
      exec_mode: "cluster", // Enables cluster mode for load balancing
      watch: false, // Set to true if you want to enable file watching
    },
  ],
};
