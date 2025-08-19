const InvariantError = require('../../src/exceptions/InvariantError');
const { PostAuthSchema, PutAuthSchema, DeleteAuthSchema } = require('./schema');

module.exports = {
  validatePostAuthPayload: (payload) => {
    const { error } = PostAuthSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validatePutAuthPayload: (payload) => {
    const { error } = PutAuthSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateDeleteAuthPayload: (payload) => {
    const { error } = DeleteAuthSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
