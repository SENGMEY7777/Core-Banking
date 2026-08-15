const { sendResponse } = require('../utils/responseHelper');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      convert: true
    });

    if (error) {
      const details = error.details.map(({ path, message }) => ({
        field: path.join('.'),
        message
      }));

      return sendResponse(res, 400, false, 'Validation failed', null, details);
    }

    req[property] = value;
    return next();
  };
}

module.exports = validate;
