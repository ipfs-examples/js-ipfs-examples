module.exports = {
    configureWebpack: {
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/')
            }
        }
    }
}
