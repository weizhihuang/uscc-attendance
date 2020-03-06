module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: ["nfc-pcsc"]
    }
  },
  transpileDependencies: ["vuetify"]
};
