/**
 * is
 * A simple module to confirm an expected type and/or shape for JavaScript variables.
 * @version 0.1.0
 * @module
 */

/** number */

const number = (src) => (typeof src === 'number');

const numberOrNull = (src) => ((typeof src === 'number') || (src === null));

/** string */

const string = (src) => (typeof src === 'string');

const stringWithSomething = (src) => (string(src) && Boolean(src.length));

const stringFromDistinct = (arg, distinctList) => {
  if (!string(arg)) return false;
  return distinctList.includes(arg);
};

const stringFromDistinctOrNothing = (arg, distinctList) => {
  if (!string(arg)) return false;
  return (arg.length === 0) || distinctList.includes(arg);
};

/** Array */

const array = (src) => Array.isArray(src);

const arrayWithSomething = (src) => (Array.isArray(src) && Boolean(src.length));

const arrayOfStringValues = (src) => {
  if (!array(src)) return false;
  return src.every((testArg) => (typeof testArg === 'string'));
};

const arrayOfStringWithSomethingValues = (src) => {
  if (!array(src)) return false;
  return src.every((testArg) => ((typeof testArg === 'string') && Boolean(testArg.length)));
};

const arrayOfNumberValues = (src) => {
  if (!array(src)) return false;
  return src.every((testArg) => (typeof testArg === 'number'));
};

const arrayOfNumberOrNullValues = (src) => {
  if (!array(src)) return false;
  return src.every((testArg) => ((typeof testArg === 'number') || (testArg === null)));
};

/** Record
 *
 * For our purposes:
 *   Record: instance of a non-array object, for example {} or { lastName: 'Smith' }
*/

const record = (src) => (typeof src === 'object' && !Array.isArray(src) && src !== null);

const recordWithProperties = (src, expectedProperties = []) => {
  if (!record(src)) return false;
  if (!arrayOfStringWithSomethingValues(expectedProperties)) return false;

  const srcProperties = Object.keys(src);

  return expectedProperties.every((expectedProperty) => (srcProperties.includes(expectedProperty)));
};

const recordWithPropertiesExclusively = (src, expectedProperties = []) => {
  if (!recordWithProperties(src, expectedProperties)) return false;

  const srcProperties = Object.keys(src);

  return (srcProperties.length === expectedProperties.length);
};

const recordWithPropertiesAndStringValues = (src, expectedProperties = [], exclusive = false) => {
  if (!recordWithProperties(src, expectedProperties, exclusive)) return false;

  const srcEntries = Object.entries(src);

  return srcEntries.every(([testProperty, testValue]) => (!expectedProperties.includes(testProperty) || typeof testValue === 'string'));
};

export default {
  number,
  numberOrNull,
  string,
  stringWithSomething,
  stringFromDistinct,
  stringFromDistinctOrNothing,
  array,
  arrayWithSomething,
  arrayOfStringValues,
  arrayOfStringWithSomethingValues,
  arrayOfNumberValues,
  arrayOfNumberOrNullValues,
  record,
  recordWithProperties,
  recordWithPropertiesExclusively,
  recordWithPropertiesAndStringValues,
};
