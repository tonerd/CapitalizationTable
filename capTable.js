const fs = require('fs');
const readline = require('readline');
const utils = require('./utils');

module.exports = {
  generate: (filePath, date) => readFile(filePath, date)
}

const columns =  {
  '#INVESTMENT DATE': 0,
  'SHARES PURCHASED': 1,
  'CASH PAID': 2,
  'INVESTOR': 3
};

/**
 * Reads csv file, parses data, and displays capitalization table
 *
 * @param {string} filePath The path to the csv file.
 * @param {Date} date The date to compute the table from.
 * @return {Promise} The json representation of the data.
 */
function readFile(filePath, date) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (error, stats) => {
      if(error || !stats.isFile()) {
        return reject(new Error('Could not find ' + filePath));
      }

      //stream lines of csv
      const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
      });

      //flag to allow us to skip first row of csv containing headers
      let isDataStart = false;

      const totals =  {
        cash : 0,
        shares: 0
      };

      const ownership = {};

      //read one line at a time
      lineReader.on('line', (line) => {
        if(isDataStart) {
          try {
            addData(date, line, totals, ownership);
          }
          catch(error) {
            return reject(error);
          }
        }
        isDataStart = true;
      });

      //display result
      lineReader.on('close', () => {
        resolve(getJson(date, totals, ownership));
      });
    });
  });
}

/**
 * Adds the data from the line of the csv file to the current data sets.
 *
 * @param {Date} date The date to compute the table from.
 * @param {string} line A line of data from the csv.
 * @param {Object} totals The running totals for shares and cash.
 * @param {Object} ownership A hashmap with running totals for investors.
 */
function addData(date, line, totals, ownership) {
  let items = line.split(',');

  //get row date
  let dateString = items[columns['#INVESTMENT DATE']];

  if(isNaN(Date.parse(dateString))) {
    throw new Error('Date was not in proper format in csv.');
  }

  let itemDate = utils.getLocalDate(dateString)

  //check row date to see if we should include data in table
  if(itemDate <= date) {
    let itemShares = items[columns['SHARES PURCHASED']].trim();
    let itemCash = items[columns['CASH PAID']].trim();
    let itemInvestor = items[columns['INVESTOR']].trim();

    if(!utils.isPositiveInteger(itemShares)) {
      throw new Error('Shares were not in proper format in csv.')
    }

    if(!utils.isDecimal(itemCash)) {
      throw new Error('Cash paid was not in proper format in csv.')
    }

    if(itemInvestor.length === 0) {
      throw new Error('Investor not specified in csv.');
    }

    //build up hashmap of data per investor
    let key = itemInvestor.toLowerCase();
    if(!ownership[key]) {
      ownership[key] = {
        investor: itemInvestor,
        shares: 0,
        cash_paid: 0
      };
    }

    let intShares = parseInt(itemShares);
    let intCash = (itemCash * 100);
    ownership[key].shares += intShares;
    ownership[key].cash_paid += intCash;

    //add to running totals
    totals.shares += intShares;
    totals.cash += intCash;

    if(totals.shares === Number.POSITIVE_INFINITY ||
      totals.cash ===  Number.POSITIVE_INFINITY) {
      throw new Error('Maximum value exceeded while calculating table.')
    }
  }
}

/**
 * Gets the json representation of the data sets.
 *
 * @param {Date} date The date to compute the table from.
 * @param {Object} totals The running totals for shares and cash.
 * @param {Object} ownership A hashmap with running totals for investors.
 * @return {Object} The json representation of the data.
 */
function getJson(date, totals, ownership) {
  let ownerData = [];

  //calculate ownership percentage and format data
  let keys = Object.keys(ownership);
  for(let i = 0; i < keys.length; i++) {
    let key = keys[i];
    ownership[key].ownership = parseFloat((ownership[key].shares / totals.shares * 100).toFixed(2));
    ownership[key].cash_paid = ownership[key].cash_paid / 100;
    ownerData.push(ownership[key]);
  }

  return {
    date: utils.formatDate(date),
    cash_raised: totals.cash / 100,
    total_number_of_shares: totals.shares,
    ownership: ownerData
  }
}
