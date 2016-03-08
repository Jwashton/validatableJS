'use strict';

let Validatable = function() {
  let validations = [];
  let contexts = [];

  let localValid = function() {
    return validations
      .map((validation) => { return validation.validator(); })
      .reduce((acc, result) => { return acc && result }, true);
  };

  let nestedValid = function() {
    return contexts
      .map((context) => { return !context.condition() || context.context.isValid; })
      .reduce((acc, result) => { return acc && result }, true);
  };

  Object.defineProperty(this, 'isValid', {
    get: function() {
      let local = localValid();
      let nested = nestedValid();

      return localValid() && nestedValid();
    },
    enumerable: true
  });

  Object.defineProperty(this, 'errors', {
    get: function() {
      return validations.map((validation) => {
        if (! validation.validator()) { return validation.failMsg; }
      }).filter((result) => { return result });
    },
    enumerable: true
  });

  this.validate = function(failMsg, validator) {
    validations.push({ failMsg, validator });
  };

  this.when = function(condition, registrar) {
    let context = new Validatable();

    registrar(context);

    contexts.push({ condition, context });
  };
};

module.exports = Validatable;
