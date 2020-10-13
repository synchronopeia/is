# Simple Type and Shape Confirmation Library

A simple library to confirm expected types and/or shapes for JavaScript variables.

So often for example, we're expecting input something like ```['words', 'in', 'an', 'array']```, in which case ```is.array()```, ```is.arrayWithSomething()```, ```is.arrayOfStrings()```, or ```is.arrayOfStringsWithSomething()``` can be useful.

Additionally, we use ```null``` to represent an "unset" or missing value for an ostensibly "number" type. The simple ```is.number()``` and ```is.numberOrNull()``` leverages a lot of power into our workflow.

Recognizing the subtle differences between things and defining a grammar that differentiates them helps us write reliable and understandable code.

Thus:

- is.number(src)
- is.numberOrNull(src)
- is.string(src)
- is.stringWithSomething(src)
- is.stringFromDistinct(src, distinctItems)
- is.stringFromDistinctOrNothing(src, distinctItems)
- is.array(src)
- is.arrayWithSomething(src)
- is.arrayOfStringValues(src)
- is.arrayOfStringWithSomethingValues({})
- is.arrayOfNumberValues(src)
- is.arrayOfNumberOrNullValues(src)
- is.record(src)
- is.recordWithProperties(src, expectedProperties)
- is.recordWithPropertiesExclusively(src, expectedProperties)
- is.recordWithPropertiesAndStringValues(src, expectedProperties)

Inspired by TypeScript. Tempered by a reluctance to adopt TypeScript?

Thanks to Adam Nathaniel Davis for his [series](https://dev.to/bytebodger/tossing-typescript-1md3) and associated code [GitHub](https://github.com/bytebodger/type-checking/blob/master/is.js).

## Requirements

We use es6 modules (Node version >= 13.2.0). See [Announcing core Node.js support for ECMAScript modules](https://medium.com/@nodejs/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663).

## Use

```javascript
import is from 'is';

/**
 * number ("primitive")
 */

// is.number(src)

// → false
is.number({});
is.number('a');
is.number('1');
is.number(undefined);
is.number(null);
// → true
is.number(2);
is.number(0);
is.number(-2);

// is.numberOrNull(src)

// → false
is.numberOrNull({});
is.numberOrNull('a');
is.numberOrNull('1');
is.numberOrNull(undefined);
// → true
is.numberOrNull(null);
is.numberOrNull(2);
is.numberOrNull(0);
is.numberOrNull(-2);

/**
 * string ("primitive")
 */

const SENTENCE = 'This is a sentence.';

// is.string(src)

// → false
is.string(2);
// → true
is.string('');
is.string(SENTENCE);

// is.stringWithSomething(src)

// → false
is.stringWithSomething(2);
is.stringWithSomething('');
// → true
is.stringWithSomething(SENTENCE);

/**
 * string distinct
 */

const DISTINCT_INTEREST_LEVEL_RESPONSE = [
  'not-interested',
  'somewhat-interested',
  'very-interested'];

// is.stringFromDistinct(src, distinctItems)

// → false
is.stringFromDistinct('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE);
is.stringFromDistinct('', DISTINCT_INTEREST_LEVEL_RESPONSE);
// → true
is.stringFromDistinct('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE);

// is.stringFromDistinctOrNothing(src, distinctItems)

// → false
is.stringFromDistinctOrNothing('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE);
// → true
is.stringFromDistinctOrNothing('', DISTINCT_INTEREST_LEVEL_RESPONSE);
is.stringFromDistinctOrNothing('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE);

/**
 * Array
 */

const ARRAY_OF_NUMBERS = [1, 2, 3, 4];
const ARRAY_OF_STRINGS = ['words', 'in', 'an', 'array'];

// is.array(src)

// → false
is.array({});
// → true
is.array([]);
is.array(ARRAY_OF_STRINGS);

// is.arrayWithSomething(src)

// → false
is.arrayWithSomething({});
is.arrayWithSomething([]);
// → true
is.arrayWithSomething(ARRAY_OF_STRINGS);

// is.arrayOfStringValues(src)

// → false
is.arrayOfStringValues({});
is.arrayOfStringValues(ARRAY_OF_NUMBERS);
// → true
is.arrayOfStringValues([]);
is.arrayOfStringValues(ARRAY_OF_STRINGS);
is.arrayOfStringValues([...ARRAY_OF_STRINGS, '']); // note inclusion of empty string

// is.arrayOfStringWithSomethingValues(src)

// → false
is.arrayOfStringWithSomethingValues({});
is.arrayOfStringWithSomethingValues(ARRAY_OF_NUMBERS);
is.arrayOfStringWithSomethingValues([...ARRAY_OF_STRINGS, '']);
// → true
is.arrayOfStringWithSomethingValues([]);
is.arrayOfStringWithSomethingValues(ARRAY_OF_STRINGS);

// is.arrayOfNumberValues(src)

// → false
is.arrayOfNumberValues({});
is.arrayOfNumberValues(ARRAY_OF_STRINGS);
is.arrayOfNumberValues([...ARRAY_OF_NUMBERS, null]); // note inclusion of null
// → true
is.arrayOfNumberValues(ARRAY_OF_NUMBERS);
is.arrayOfNumberValues([]);

// is.arrayOfNumberOrNullValues(src)

// → false
is.arrayOfNumberOrNullValues({});
is.arrayOfNumberOrNullValues(ARRAY_OF_STRINGS);
// → true
is.arrayOfNumberOrNullValues([...ARRAY_OF_NUMBERS, null]);
is.arrayOfNumberOrNullValues(ARRAY_OF_NUMBERS);
is.arrayOfNumberOrNullValues([]);

/**
 * Record
 *
 * non-array object with enumerable properties
*/

const RECORD = {
  name: 'Brazil',
  currency: 'BRL',
  language: 'pt',
  mapCenter: [-9, -55],
  mapZoom: 3,
};

const PROPERTIES_REFERENCING_STRINGS = ['name', 'currency', 'language'];
const PROPERTIES_REFERENCING_NON_STRINGS = ['mapCenter', 'mapZoom'];
const PROPERTIES = [...PROPERTIES_REFERENCING_STRINGS, ...PROPERTIES_REFERENCING_NON_STRINGS];

// is.record(src)

// → false
is.record(ARRAY_OF_STRINGS);
is.record(null);
// → true
is.record({});
is.record(RECORD);

// is.recordWithProperties(src, expectedProperties)

// → false
is.recordWithProperties(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty']);
// → true
is.recordWithProperties(RECORD, PROPERTIES_REFERENCING_STRINGS);
is.recordWithProperties(RECORD, PROPERTIES);

// is.recordWithPropertiesExclusively(src, expectedProperties)

// → false
is.recordWithPropertiesExclusively(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty']);
is.recordWithPropertiesExclusively(RECORD, PROPERTIES_REFERENCING_STRINGS);
// → true
is.recordWithPropertiesExclusively(RECORD, PROPERTIES)) // RECORD contains only the properties specified by PROPERTIES

// is.recordWithPropertiesAndStringValues(src, expectedProperties)

// → false
is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES);
is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_NON_STRINGS);
is.recordWithPropertiesAndStringValues(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty']);
// → true
is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_STRINGS);
```
