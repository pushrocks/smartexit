import { expect, tap } from '@pushrocks/tapbundle';
import * as smartexit from '../ts/index';

let testSmartexit: smartexit.SmartExit;

tap.test('first test', async () => {
  testSmartexit = new smartexit.SmartExit();
});

tap.test('should end processes upon SIGINT', async tools => {
  await tools.delayFor(5000);
});

tap.start();
