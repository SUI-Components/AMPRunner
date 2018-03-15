const swig = require('swig')
const cleaner = require('./cleaner')

module.exports = ({ data, template }) =>
  swig.render(template, { locals: cleaner({ data }) })
