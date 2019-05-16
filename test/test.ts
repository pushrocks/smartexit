import { expect, tap } from '@pushrocks/tapbundle';
import * as smartexit from '../ts/index'

tap.test('first test', async () => {
  console.log(smartexit.standardExport)
})

tap.start()
