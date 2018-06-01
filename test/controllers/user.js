/**
 * Author:ll36
 * Create Time:2018/03/18 16:55
 * Descripttion:
 */
describe('index.js: ', function() {
  it('loginIn() should work fine.', function() {
    expect(loginIn(1)).toBe(true)
    expect(loginIn('1')).toBe(false);
  });
});