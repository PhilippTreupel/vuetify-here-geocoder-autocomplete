module.exports = {
  publicPath: "",
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
