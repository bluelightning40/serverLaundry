require('dotenv').config()

/**
 * Check for inputs inside req.body
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

module.exports = {
  inputChecks,
}
