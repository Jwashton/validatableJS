# validatableJS
A model validations mixin for JS

## Basic example

```javascript
let Widget = function() {
  assign(this, new Validatable());

  this.weight = 10;
  this.height = 20;

  this.validate('weight must be greater than height', () => {
    return this.weight > this.height;
  });
};

let gadget = new Widget();

console.log(gadget.isValid); // false
console.log(gadget.errors); // ['weight must be greater than height'];

gadget.weight = 40;

console.log(gadget.isValid); // true
```

## Contexts

You can also provide a conditional context for the validation with the `when`
method.

```javascript
let active = function() {
  this.health > 30;
};

this.when(this.active, (context) => {
  context.validate('cost must be divisible by 20', () => this.cost % 20 === 0);
});
```
