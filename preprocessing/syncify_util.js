const { execSync } = require('child_process');

module.exports = (asyncModulePath) =>
    (...args) => {
        const argsJSON = JSON.stringify(args)
        const script = `require("${asyncModulePath}")(...${argsJSON}).then(r => process.stdout.write(JSON.stringify(r))).catch(r => process.stderr.write(JSON.stringify(r)))`;
        const shellCommand = `node -e "${script.replace(/(")/g, '\\$1')}"`;
        const resultJSON = execSync(shellCommand);
        return JSON.parse(resultJSON);
    };
