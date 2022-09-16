const dayjs = require('dayjs')

require('dotenv').config()

/**
 * Check for inputs inside req.body.
 *
 * This function fails if one of the inputs is missing or null
 * @param {Array} inputs - List of inputs to check
 * @param {Object} body - req.body
 * @param {Boolean} [isStrict = false] - (False by default) if true, will return false if there are other property in body
 * @param {Object} customError - Custom Error object to throw if function fails
 *
 * NB: This function also fails if body doesn't have anything
 */

function inputChecks(
  inputs,
  body,
  isStrict = false,
  customError = {
    status: 400,
    customMessage: `Missing inputs. Please read ${process.env.DOCUMENTATION_URL} for more information`,
  }
) {
  if (Object.keys(body).length === 0) throw customError

  const isAllInputsExist = inputs.every((value) => value in body)
  if (!isAllInputsExist) throw customError

  for (const key in body) {
    if (!body[key] && body[key] !== false) throw customError
  }

  if (isStrict && Object.keys(body).length != inputs.length) throw customError

  return true
}

/**
 * Generate id, createId, and updateId
 * @param {Connection} connection - DB Connection
 * @param {String} tableName - Name of the table
 * @param {String} prefixId - String at the start of the id
 * @returns {String} id, createId, and updateId
 */

async function userNumberGenerator(connection, tableName, prefixId) {
  let dateString = dayjs().format('DDMMYY')
  let query = `SELECT * FROM ${tableName} WHERE customer_id like '${prefixId}${dateString}%'`
  const [rows] = await connection.query(query)

  // Creating IDs
  const userNumber = `${dateString}${`${rows.length + 1}`.padStart(4, '0')}`
  return {
    id: `${prefixId}${userNumber}`,
    createId: `${prefixId}C${userNumber}`,
    updateId: `${prefixId}U${userNumber}`,
  }
}

/**
 * Helper to throw error.
 *
 * Error thrown will get caught by the express error handler
 *
 * Example:
 *
 *     throwError(404, 'user not found');
 *
 * @param {Number} statusCode - HTTP response status code, refer to https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @param {String} message - Error message
 *
 */

function throwError(statusCode, message) {
  throw { status: statusCode, customMessage: message }
}

module.exports = {
  inputChecks,
  userNumberGenerator,
  throwError,
}
