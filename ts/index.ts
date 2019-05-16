import * as plugins from './smartexit.plugins';

export class SmartExit {
  public static processesToEnd = new plugins.lik.Objectmap<plugins.childProcess.ChildProcess>();
  public static async addProcess(childProcessArg: plugins.childProcess.ChildProcess) {
    SmartExit.processesToEnd.add(childProcessArg);
  }

  public static async killAll() {
    console.log('Checking for remaining child processes before exit...');
    if (this.processesToEnd.getArray().length > 0) {
      console.log('found remaining child processes');
      let counter = 1;
      SmartExit.processesToEnd.forEach(async childProcessArg => {
        console.log(`killing process #${counter}`);
        childProcessArg.kill('SIGINT');
        counter++;
      });
    } else {
      console.log(`Everything looks clean. Ready to exit!`);
    }
  }
}

// do app specific cleaning before exiting
process.on('exit', async () => {
  await SmartExit.killAll();
});

// catch ctrl+c event and exit normally
process.on('SIGINT', async () => {
  console.log('Ctrl-C...');
  await SmartExit.killAll();
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', async err => {
  console.log('Ctrl-C...');
  await SmartExit.killAll();
});
