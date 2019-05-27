import * as plugins from './smartexit.plugins';

export class SmartExit {
  public processesToEnd = new plugins.lik.Objectmap<plugins.childProcess.ChildProcess>();

  /**
   * adds a process to be exited
   * @param childProcessArg
   */
  public addProcess(childProcessArg: plugins.childProcess.ChildProcess) {
    this.processesToEnd.add(childProcessArg);
  }

  /**
   * removes a process to be exited
   */
  public removeProcess(childProcessArg: plugins.childProcess.ChildProcess) {
    this.processesToEnd.remove(childProcessArg);
  }

  public async killAll() {
    console.log('SMARTEXIT: Checking for remaining child processes before exit...');
    if (this.processesToEnd.getArray().length > 0) {
      console.log('found remaining child processes');
      let counter = 1;
      this.processesToEnd.forEach(async childProcessArg => {
        const pid = childProcessArg.pid;
        console.log(`SMARTEXIT: killing process #${counter} with pid ${pid}`);
        plugins.smartdelay.delayFor(10000).then(() => {
          if (childProcessArg.killed) {
            return;
          }
          process.kill(-pid, 'SIGKILL');
        });
        process.kill(-pid, 'SIGINT');
        
        counter++;
      });
    } else {
      console.log(`SMARTEXIT: Everything looks clean. Ready to exit!`);
    }
  }

  constructor() {
    // do app specific cleaning before exiting
    process.on('exit', async (code) => {
      if (code === 0) {
        console.log('SMARTEXIT: Process wants to exit');
        await this.killAll();
      }
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', async () => {
      console.log('SMARTEXIT: Ctrl-C... or SIGINT signal received!');
      await this.killAll();
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', async err => {
      console.log('SMARTEXIT: uncaught exception...');
      console.log(err);
      await this.killAll();
      process.exit(1);
    });
  }
}
