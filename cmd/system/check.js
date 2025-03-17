const platform = require('process').platform;
const { exec } = require('child_process');
const env = require('../../lib/env');
const fs = require('fs');
module.exports = {
    command: 'check',
    describe: 'ensure the system is correctly configured',
    handler: () => {
        if (platform == "win32") {
            exec('(net session >nul 2>&1 & echo %ERRORLEVEL%)', function (err, stdout) {
                if(err||!stdout.includes("0")){
                    console.error("You are running as root\nThis is insecure and not supported by Pelias.\nPlease try again as a non-root user.")
                    process.exit(1);
                }
            });
        }
        //Assuming that ever other platform is *nix related
        else {
            exec('echo $(id -u ${SUDO_USER-${USER}}):$(id -g ${SUDO_USER-${USER}})', function (err, stdout, stderror) {
                if (stdout == "0:0") {
                    console.error("You are running as root\nThis is insecure and not supported by Pelias.\nPlease try again as a non-root user.")
                    process.exit(1);
                }
            })
        }
        if (!env().DATA_DIR) {
            console.error("You must set the DATA_DIR env var to a valid directory on your local machine.\n");
            console.error("Edit the '.env' file in this repository, update the DATA_DIR to a valid path and try again.")
            console.error("Alternatively, you can set the variable in your environment using a command such as 'export DATA_DIR=/tmp'.")
            process.exit(1);
        }
        if (!fs.existsSync(env().DATA_DIR)) {
            console.error(`The directory specified by DATA_DIR does not exist:\n ${env().DATA_DIR}`);
            console.error("Edit the '.env' file in this repository, update the DATA_DIR to a valid path and try again.");
            console.error("Alternatively, you can set the variable in your environment using a command such as 'export DATA_DIR=/tmp'.");
            process.exit(1);
        }
    }
}