const fs = require('fs');
const capTable = require('./capTable');
const utils = require('./utils');

/**
 * Main function to parse csv and return capitalization table.
 */
async function Main() {
  let date = null;
  let filePath = process.argv[2];

  //check if file exists
  if(!filePath || !fs.existsSync(filePath)) {
    return console.log('Please specify a path to a csv file.');
  }

  //check if data is specified and valid
  let dateString = process.argv[3];
  if(dateString) {
    date = new Date(process.argv[3]);

    if(isNaN(Date.parse(dateString))) {
      return console.log('Please enter a valid date.');
    }

    date = utils.getLocalDate(dateString);
  }
  else {
    date = new Date();
  }

  try {
    console.log(await capTable.generate(filePath, date));
  }
  catch(error) {
    console.log(error.message);
  }
}

Main();
