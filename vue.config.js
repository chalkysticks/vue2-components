module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    css: {
        extract: false
    }
}