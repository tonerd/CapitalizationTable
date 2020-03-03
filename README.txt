SUMMARY:
This application generates capitalization table JSON.  It takes two parameters,
The first being the path to a CSV file, and the second an optional date
parameter.

PREREQUISITES:
Node is required to be installed for this application to run.

EXECUTION:
Open a command prompt to the project directory, and execute the app.js file
with arguments for the path to the csv file and optional date parameter in
YYYY-MM-DD format.

For example: "node app tests/csv/sample.csv 2017-11-14"

TESTS:
To run tests, first run "npm install" to install testing framework.  Then run
"npm test" to execute tests.

NOTE:
The problem statement shows example JSON output containing number values with
trailing zeros.  This is not possible with JavaScript.  In order to achieve
this, I could use toFixed(2), but this would return the value as a string.  As
the example output has numbers, I have chosen to return these values as numbers
without the trailing zeros.
