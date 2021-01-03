module.exports = {
  transpileDependencies: ["vuetify"],
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      libraryExport: "default"
    }
  }
};
