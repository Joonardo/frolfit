module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/sass/_variables.scss";
        `
      }
    }
  }
};
