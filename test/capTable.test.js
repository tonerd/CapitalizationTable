const assert = require('assert');
const capTable = require('../capTable');
const utils = require('../utils');

describe('generate', () => {
  it('should generate a capitalization table with current date', async () => {
    const date = new Date();
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 165500,
      "total_number_of_shares": 9500,
      "ownership": [
        {
          investor: "Sandy Lerner",
          shares: 3000,
          cash_paid: 60000,
          ownership: 31.58
        },
        {
          investor: "Don Valentine",
          shares: 3000,
          cash_paid: 52000,
          ownership: 31.58
        },
        {
          investor: "Ann Miura-Ko",
          shares: 2000,
          cash_paid: 40000,
          ownership: 21.05
        },
        {
          investor: "Fred Wilson",
          shares: 1500,
          cash_paid: 13500,
          ownership: 15.79
        }
      ]
    };

    const actualResult = await capTable.generate('test/csv/sample.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('should generate a capitalization table with previous date', async () => {
    const date = utils.getLocalDate('2017-11-14');
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 22000,
      "total_number_of_shares": 2000,
      "ownership": [
        {
          investor: "Sandy Lerner",
          shares: 1000,
          cash_paid: 10000,
          ownership: 50
        },
        {
          investor: "Don Valentine",
          shares: 1000,
          cash_paid: 12000.00,
          ownership: 50
        }
      ]
    };

    const actualResult = await capTable.generate('test/csv/sample.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('should generate a capitalization table with date before existing data', async () => {
    const date = utils.getLocalDate('2015-11-14');
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 0,
      "total_number_of_shares": 0,
      "ownership": []
    };

    const actualResult = await capTable.generate('test/csv/sample.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('should throw error if file does not exist', () => {
    assert.rejects(capTable.generate('test/csv/fake.csv', new Date()));
  });

  it('should throw error if cash value invalid', () => {
    assert.rejects(capTable.generate('test/csv/invalidCash.csv', new Date()));
  });

  it('should throw error if date value invalid', () => {
    assert.rejects(capTable.generate('test/csv/invalidDate.csv', new Date()));
  });

  it('should throw error if shares value invalid', () => {
    assert.rejects(capTable.generate('test/csv/invalidShares.csv', new Date()));
  });

  it('should throw error if investor missing', () => {
    assert.rejects(capTable.generate('test/csv/missingInvestor.csv', new Date()));
  });

  it('should throw error if shares exceed maximum value', () => {
    assert.rejects(capTable.generate('test/csv/largeShares.csv', new Date()));
  });

  it('should throw error if cash exceeds maximum value', () => {
    assert.rejects(capTable.generate('test/csv/largeCash.csv', new Date()));
  });

  it('should generate a capitalization table with special characters in investor names', async () => {
    const date = new Date();
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 165500,
      "total_number_of_shares": 9500,
      "ownership": [
        {
          investor: "Sandy O'Lerner",
          shares: 3000,
          cash_paid: 60000,
          ownership: 31.58
        },
        {
          investor: "Don M. Va$lentine",
          shares: 3000,
          cash_paid: 52000,
          ownership: 31.58
        },
        {
          investor: "Ann Mi`ura-Ko",
          shares: 2000,
          cash_paid: 40000,
          ownership: 21.05
        },
        {
          investor: "Fred Wi+lson",
          shares: 1500,
          cash_paid: 13500,
          ownership: 15.79
        }
      ]
    };

    const actualResult = await capTable.generate('test/csv/specialCharsInNames.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('should generate a capitalization table for large data set', async () => {
    const date = new Date();
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 22876000,
      "total_number_of_shares": 2086000,
      "ownership": [
        {
          investor: "Sandy Lerner",
          shares: 1078000,
          cash_paid: 10780000,
          ownership: 51.68
        },
        {
          investor: "Don Valentine",
          shares: 1008000,
          cash_paid: 12096000,
          ownership: 48.32
        }
      ]
    };

    const actualResult = await capTable.generate('test/csv/largeDataSet.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });

  it('should be case insensitive for invenstor name', async () => {
    const date = new Date();
    const expectedResult = {
      "date": utils.formatDate(date),
      "cash_raised": 88000,
      "total_number_of_shares": 8000,
      "ownership": [
        {
          investor: "Sandy Lerner",
          shares: 4000,
          cash_paid: 40000,
          ownership: 50
        },
        {
          investor: "Don Valentine",
          shares: 4000,
          cash_paid: 48000,
          ownership: 50
        }
      ]
    };

    const actualResult = await capTable.generate('test/csv/upperAndLowerMixedName.csv', date);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
});
