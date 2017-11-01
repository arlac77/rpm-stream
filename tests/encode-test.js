import test from 'ava';
import { RPMEncoder, RPMDecoder } from '../src/codec';

const fs = require('fs');
const path = require('path');

test.skip('RPMEncoder', async t => {
  const fileName = path.join(__dirname, '..', 'build', 'xxx.rpm');

  const output = fs.createWriteStream(fileName);

  await RPMEncoder(output, { name: 'xxx', os: 'Linux', architecture: 'i386' });

  const input = fs.createReadStream(fileName);

  const result = await RPMDecoder(input);

  t.is(result.lead.version, 3);
});