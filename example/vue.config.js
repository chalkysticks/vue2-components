const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    css: {
        extract: false
    }
});
