/* eslint no-undef: "off" */
import sum from '../src/temp.js';

test('check sum', () => {
  const sum1 = sum(5, 2);
  expect(sum1).toBe(7);
});
