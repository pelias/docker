const path = require('path');
const { exec } = require('child_process');

module.exports = {
    command: 'update',
    describe: 'update the pelias command by pulling the latest version',
    handler: () => {
        const peliasRoot = path.dirname(require.main.filename);
        exec(`git -C ${peliasRoot} pull`)   
    }
}