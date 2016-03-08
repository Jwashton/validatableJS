'use strict';

let Validatable = require('../lib/validatable.js');
let assign = require('../lib/assign.js');

describe('Validatable', () => {
  let obj, proto;

  beforeEach(() => {
    obj = assign({}, new Validatable());
    obj.foo = 5;
  });

  describe('without validations', () => {
    it('is valid', () => {
      expect(obj.isValid).toBe(true);
    });

    it('has no errors', () => {
      expect(obj.errors).toEqual([]);
    });
  });

  describe('with basic validations', () => {
    beforeEach(() => {
      obj.validate('foo must be less than 3', () => obj.foo < 3);
    });

    it('can validate a local attribute', () => {
      expect(obj.isValid).toBe(false);
      obj.foo = 2;
      expect(obj.isValid).toBe(true);
    });

    it('reports the fail messages', () => {
      expect(obj.errors.length).toBe(1);
      expect(obj.errors[0]).toBe('foo must be less than 3');
    });

    it('is only valid if all validations pass', () => {
      obj.validate('foo must be greater than 2', () => obj.foo > 2);
      obj.foo = 1;
      expect(obj.isValid).toBe(false);
    });
  });

  describe('with contextual checks', () => {
    beforeEach(() => {
      obj.bar = 4;
      obj.when(() => obj.bar > 7, (context) => {
        context.validate('foo must be less than 3', () => obj.foo < 3);
      });
    });

    it('won’t apply the validations if a condition isn’t met', () => {
      expect(obj.isValid).toBe(true);
    });

    it('will apply the validation if the condition is met', () => {
      obj.bar = 8;
      expect(obj.isValid).toBe(false);
    });
  });

  describe('when used multiple times', () => {
    it('will have interferance between instances', () => {
      let widget = assign({}, new Validatable());
      widget.baz = 5;
      widget.validate('baz must be even', () => widget.baz % 2 === 0);
      obj.validate('foo must be greater than 3', () => obj.foo > 3);

      expect(widget.isValid).toBe(false);
      expect(obj.isValid).toBe(true);
    });
  });

  describe('when used internaly', () => {
    it('can still be accessed', () => {
      let Thing = function() {
        assign(this, new Validatable());
        
        this.whizzy = 2;
        this.zowie = 4;

        this.validate('whizzy must be greater than zowie', () => {
          return this.whizzy > this.zowie;
        });
      };

      let gadget = new Thing();
      expect(gadget.isValid).toBe(false);
      gadget.whizzy = 8;
      expect(gadget.isValid).toBe(true);
    });
  });
});
