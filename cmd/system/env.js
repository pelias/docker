module.exports = {
    command: 'env',
    describe: 'display environment variables',
    handler: () => {
        Object.entries(process.env).forEach(entry => {
            //Mimic the default bash env return value
            console.log(entry[0] + "=" + entry[1]);
        });
    }

}