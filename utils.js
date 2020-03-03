const decimalRegExp = new RegExp(/^\d*(\.\d{1,2})?$/);
const positiveIntegerRegExp = new RegExp(/^[1-9]\d*$/);

module.exports = {
  /**
   * Gets the date in mm/dd/yyyy format.
   *
   * @param {Date} date The date to convert.
   * @return {string} The date in mm/dd/yyyy format.
   */
  formatDate: (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if(month < 10) {
      month = '0' + month;
    }

    if(day < 10) {
      day = '0' + day;
    }

    return month + '/' + day + '/' + date.getFullYear();
  },
  /**
   * Gets the local date, taking into account offset
   *
   * @param {string} date The date to convert.
   * @return {Date} An adjusted date based on timezone offset
   */
  getLocalDate: (date) => {
    let newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    return newDate;
  },
  /**
   * Determines if the value is a number with at most two decimal places.
   *
   * @param {string} value The value to check.
   * @return {boolean} Whether the value has at most two decimal places.
   */
  isDecimal: (value) => decimalRegExp.test(value),
  /**
   * Determines if the value is an integer.
   *
   * @param {string} value The value to check.
   * @return {boolean} Whether the value is an integer.
   */
  isPositiveInteger: (value) => positiveIntegerRegExp.test(value)
}
