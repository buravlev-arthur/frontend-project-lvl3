/* eslint no-undef: "off" */

import sum from '../src/sum.js';

test('check sum', () => {
  const sum1 = sum(2, 5);
  const sum2 = sum(10, -5);

  expect(sum1).toBe(7);
  expect(sum2).toBe(5);
});
