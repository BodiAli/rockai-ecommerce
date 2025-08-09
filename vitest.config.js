const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: "./tests/setup/setup.js",
  },
});
