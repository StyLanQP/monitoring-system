const app = require('./app/app.js');

const chalk = require('chalk');

app.listen(4000, () => {
    console.log(chalk.yellow('启动成功' + 4000))
})