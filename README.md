# type-node

## Little lib for easier work with types.

- Respects language nature and acknowledges its quirks

### Example

```javascript
const type = require('@nikitanaversus/type-node');

type.use('email', e => /^[^]+\@\w+\.\w+$/.test(e));

type.use('description', e => e.trim().length > 100);

const schema = {
  id: {
    type: 'number',
    required: true,
  },
  description: {
    type: 'description',
  },
};

function addUser(email, password, data) {
  if (type.is(email, 'email') && type.shape(data, schema)) {
    // Logic
  }
}
```

## Installation

```
npm install @nikitanaversus/type-node
```

`is(e: any, type: string | any): boolean`

Check if element type equal type

```javascript
const type = require('@nikitanaversus/type-node');

console.log(type.is('something', 'string')); // true
console.log(type.is(12.1, 'float')); // true
console.log(type.is(12.1, 'number')); // true
console.log(type.is(12, 'number')); // true
console.log(type.is({}, ['object', 'string'])); // true, also have multiple mode
```

#### types

- string
- number
- boolean
- int
- float
- simbol
- object
- array
- function
- regexp
- undefined
- null
- error
- date
- promise
- iterable

also you can add your custom type with `"use"` or add pack with `"pack"`.

`use(name: string, validator: function): void`

Use to add new custom type.

```javascript
const type = require('@nikitanaversus/type-node');

// Must return boolean
type.use('email', e => /^[^]+\@\w+\.\w+$/.test(e));

console.log(type.is('me@email.com', 'email')); // true
```

`of(e: any): string`

return type(s) of element, with custom or pack types.

```javascript
const type = require('@nikitanaversus/type-node');

type.use('email', v => /^[^]+\@\w+\.\w+$/.test(v));

console.log(type.of(12.1)); // 'float'
console.log(type.of('string')); // 'string'
console.log(type.of('me@email.com')); // ['string', 'email']
```

`shape(e: any, schema: object): boolean`

Return is element equal schema

```javascript
const type = require('@nikitanaversus/type-node');

// Schema key options
const schema = {
  name: {
    type: 'string', //type of value,
    required: true, //is this key required
  },
  age: {
    type: 'int',
  },
};

const data = {
  name: 'Nikita',
};

console.log(type.shape(data, schema)); // true
```
