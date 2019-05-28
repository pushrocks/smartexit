import * as plugins from './smartexit.plugins';

import { ora } from './smartexit.logging';

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
    ora.text('Checking for remaining child processes before exit...');
    if (this.processesToEnd.getArray().length > 0) {
      ora.text('found remaining child processes');
      let counter = 1;
      this.processesToEnd.forEach(async childProcessArg => {
        const pid = childProcessArg.pid;
        ora.text(`killing process #${counter} with pid ${pid}`);
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
      ora.text(`Everything looks clean. Ready to exit!`);
    }
  }

  constructor() {
    // do app specific cleaning before exiting
    process.on('exit', async (code) => {
      if (code === 0) {
        ora.text('Process wants to exit');
        await this.killAll();
        ora.finishSuccess('Exited ok!');
      } else {
        ora.finishFail('Exited NOT OK!');
      }
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', async () => {
      ora.text('Ctrl-C... or SIGINT signal received!');
      await this.killAll();
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', async err => {
      ora.text('SMARTEXIT: uncaught exception...');
      console.log(err);
      await this.killAll();
    });
  }
}
