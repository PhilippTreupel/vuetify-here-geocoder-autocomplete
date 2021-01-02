module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  transformIgnorePatterns: [
    "node_modules/(?!jest-test)" + "node_modules/(?!(jest-test))"
  ],
  setupFiles: ["<rootDir>/tests/unit/setup.js"]
};
