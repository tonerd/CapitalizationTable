const assert = require('assert');
const utils = require('../utils');

describe('formatDate', () => {
  it('should format date when month is less than 10', () => {
    let date = utils.getLocalDate('2017-01-14');
    assert.equal(utils.formatDate(date), '01/14/2017');
  });

  it('should format date when month is greater than 9', () => {
    let date = utils.getLocalDate('2013-10-12');
    assert.equal(utils.formatDate(date), '10/12/2013');
  });

  it('should format date when day is less than 10', () => {
    let date = utils.getLocalDate('2011-12-02');
    assert.equal(utils.formatDate(date), '12/02/2011');
  });

  it('should format date when month is greater than 9', () => {
    let date = utils.getLocalDate('2020-10-14');
    assert.equal(utils.formatDate(date), '10/14/2020');
  });
});

describe('isDecimal', () => {
  it('should return true for integer', () => {
    assert.ok(utils.isDecimal('10'));
  });

  it('should return true for decimal with one digit', () => {
    assert.ok(utils.isDecimal('1.4'));
  });

  it('should return true for decimal with two digits', () => {
    assert.ok(utils.isDecimal('3.23'));
  });

  it('should return false for decimal with three digits', () => {
    assert.ok(!utils.isDecimal('2.321'));
  });

  it('should return false for string with letters', () => {
    assert.ok(!utils.isDecimal('2.a3'));
  });
});

describe('isPositiveInteger', () => {
  it('should return true for integer', () => {
    assert.ok(utils.isPositiveInteger('10'));
  });

  it('should return false for zero', () => {
    assert.ok(!utils.isPositiveInteger('0'));
  });

  it('should return true for 1', () => {
    assert.ok(utils.isPositiveInteger('1'));
  });

  it('should return false for negative number', () => {
    assert.ok(!utils.isPositiveInteger('-1'));
  });

  it('should return false for decimal', () => {
    assert.ok(!utils.isPositiveInteger('2.321'));
  });

  it('should return false for string with letters', () => {
    assert.ok(!utils.isPositiveInteger('2a3'));
  });
});
