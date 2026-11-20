const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map(
        (issue) => `${issue.path.slice(1).join('.') || issue.path.join('.')}: ${issue.message}`
      );
      return next(new ApiError(400, 'Validation failed', errorMessages));
    }

    // Replace validated portions if transformed
    if (parsed.data.body) req.body = parsed.data.body;
    if (parsed.data.query) req.query = parsed.data.query;
    if (parsed.data.params) req.params = parsed.data.params;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;
