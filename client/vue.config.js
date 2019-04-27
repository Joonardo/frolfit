module.exports = {
  lintOnSave: false,
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
