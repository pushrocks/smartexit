import { expect, tap } from '@pushrocks/tapbundle';
import * as smartexit from '../ts/index';

tap.test('first test', async () => {
  smartexit;
});

tap.test('should end processes upon SIGINT', async tools => {
  await tools.delayFor(5000);
});

tap.start();
