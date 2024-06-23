const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@data': path.resolve(__dirname, 'src/data'),
        },
    },
};