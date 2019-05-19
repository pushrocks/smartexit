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
    console.log('Checking for remaining child processes before exit...');
    if (this.processesToEnd.getArray().length > 0) {
      console.log('found remaining child processes');
      let counter = 1;
      this.processesToEnd.forEach(async childProcessArg => {
        console.log(`killing process #${counter}`);
        childProcessArg.kill('SIGINT');
        counter++;
      });
    } else {
      console.log(`Everything looks clean. Ready to exit!`);
    }
  }

  constructor() {
    // do app specific cleaning before exiting
    process.on('exit', async () => {
      await this.killAll();
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', async () => {
      console.log('Ctrl-C...');
      await this.killAll();
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', async err => {
      console.log('Ctrl-C...');
      await this.killAll();
    });
  }
}
