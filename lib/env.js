const _ = require('lodash')
const dotenv = require('dotenv')

module.exports = () => {
  let env = Object.create(process.env)
  _.extend(env, dotenv.config().parsed)

  return env
}
