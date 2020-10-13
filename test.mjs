/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

import test from 'ava';

import is from './index.mjs';

/**
 * number
 */

test('is.number(src) distinguishes number/non-number', (t) => {
  // → false
  if (is.number({})) t.fail();
  if (is.number('a')) t.fail();
  if (is.number('1')) t.fail();
  if (is.number(undefined)) t.fail();
  if (is.number(null)) t.fail();
  // → true
  if (!is.number(2)) t.fail();
  if (!is.number(0)) t.fail();
  if (!is.number(-2)) t.fail();
  t.pass();
});

test('is.numberOrNull(src) recognizes null as missing "number"', (t) => {
  // → false
  if (is.numberOrNull({})) t.fail();
  if (is.numberOrNull('a')) t.fail();
  if (is.numberOrNull('1')) t.fail();
  if (is.numberOrNull(undefined)) t.fail();
  // → true
  if (!is.numberOrNull(null)) t.fail();
  if (!is.numberOrNull(2)) t.fail();
  if (!is.numberOrNull(0)) t.fail();
  if (!is.numberOrNull(-2)) t.fail();
  t.pass();
});

/**
 * string
 */

const SENTENCE = 'This is a sentence.';

test('is.string(src)', (t) => {
  // → false
  if (is.string(2)) t.fail();
  // → true
  if (!is.string('')) t.fail();
  if (!is.string(SENTENCE)) t.fail();
  t.pass();
});

test('is.stringWithSomething(src) also requires src have non-zero length', (t) => {
  // → false
  if (is.stringWithSomething(2)) t.fail();
  if (is.stringWithSomething('')) t.fail();
  // → true
  if (!is.stringWithSomething(SENTENCE)) t.fail();
  t.pass();
});

/**
 * string distinct
 */

const DISTINCT_INTEREST_LEVEL_RESPONSE = [
  'not-interested',
  'somewhat-interested',
  'very-interested'];

test('is.stringFromDistinct(src, distinct) recognizes src from distinct', (t) => {
  // → false
  if (is.stringFromDistinct('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  if (is.stringFromDistinct('', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  // → true
  if (!is.stringFromDistinct('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  t.pass();
});

test('is.stringFromDistinctOrNothing(src, distinct) also allows empty string', (t) => {
  // → false
  if (is.stringFromDistinctOrNothing('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  // → true
  if (!is.stringFromDistinctOrNothing('', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  if (!is.stringFromDistinctOrNothing('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE)) t.fail();
  t.pass();
});

/**
 * Array
 */

const ARRAY_OF_NUMBERS = [1, 2, 3, 4];
const ARRAY_OF_STRINGS = ['words', 'in', 'an', 'array'];

test('is.array(src) distinguishes array/non-array', (t) => {
  // → false
  if (is.array({})) t.fail();
  // → true
  if (!is.array([])) t.fail();
  if (!is.array(ARRAY_OF_STRINGS)) t.fail();
  t.pass();
});

test('is.arrayWithSomething(src) also expects src to have non-zero length', (t) => {
  // → false
  if (is.arrayWithSomething({})) t.fail();
  if (is.arrayWithSomething([])) t.fail();
  // → true
  if (!is.arrayWithSomething(ARRAY_OF_STRINGS)) t.fail();
  t.pass();
});

test('is.arrayOfStringValues(src) also expects each element of src array to be a string', (t) => {
  // → false
  if (is.arrayOfStringValues({})) t.fail();
  if (is.arrayOfStringValues(ARRAY_OF_NUMBERS)) t.fail();
  // → true
  if (!is.arrayOfStringValues([])) t.fail();
  if (!is.arrayOfStringValues(ARRAY_OF_STRINGS)) t.fail();
  if (!is.arrayOfStringValues([...ARRAY_OF_STRINGS, ''])) t.fail(); // note inclusion of empty string
  t.pass();
});

test('is.arrayOfStringWithSomethingValues(src) also requires strings to have non-zero length', (t) => {
  // → false
  if (is.arrayOfStringWithSomethingValues({})) t.fail();
  if (is.arrayOfStringWithSomethingValues(ARRAY_OF_NUMBERS)) t.fail();
  if (is.arrayOfStringWithSomethingValues([...ARRAY_OF_STRINGS, ''])) t.fail();
  // → true
  if (!is.arrayOfStringWithSomethingValues([])) t.fail();
  if (!is.arrayOfStringWithSomethingValues(ARRAY_OF_STRINGS)) t.fail();
  t.pass();
});

test('is.arrayOfNumberValues(src) also expects each element of src array to be a number', (t) => {
  // → false
  if (is.arrayOfNumberValues({})) t.fail();
  if (is.arrayOfNumberValues(ARRAY_OF_STRINGS)) t.fail();
  if (is.arrayOfNumberValues([...ARRAY_OF_NUMBERS, null])) t.fail(); // note inclusion of null
  // → true
  if (!is.arrayOfNumberValues(ARRAY_OF_NUMBERS)) t.fail();
  if (!is.arrayOfNumberValues([])) t.fail(); // empty array => TRUE
  t.pass();
});

test('is.arrayOfNumberOrNullValues(src) also allows null elements', (t) => {
  // → false
  if (is.arrayOfNumberOrNullValues({})) t.fail();
  if (is.arrayOfNumberOrNullValues(ARRAY_OF_STRINGS)) t.fail();
  // → true
  if (!is.arrayOfNumberOrNullValues([...ARRAY_OF_NUMBERS, null])) t.fail();
  if (!is.arrayOfNumberOrNullValues(ARRAY_OF_NUMBERS)) t.fail();
  if (!is.arrayOfNumberOrNullValues([])) t.fail();
  t.pass();
});

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

test('is.record(src) distinguishes Object {} from [] or null', (t) => {
  // → false
  if (is.record(ARRAY_OF_STRINGS)) t.fail();
  if (is.record(null)) t.fail();
  // true
  if (!is.record({})) t.fail(); // {} is a valid record => TRUE
  if (!is.record(RECORD)) t.fail();
  t.pass();
});

test('is.recordWithProperties(src, expectedProperties) also checks for the expectedProperties', (t) => {
  // → false
  if (is.recordWithProperties(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty'])) t.fail();
  // true
  if (!is.recordWithProperties(RECORD, PROPERTIES_REFERENCING_STRINGS)) t.fail(); // expectedProperties as subset of acutal keys should => TRUE
  if (!is.recordWithProperties(RECORD, PROPERTIES)) t.fail(); // exact match between actual keys and expectedProperties => TRUE
  t.pass();
});

test('is.recordWithPropertiesExclusively(src, expectedProperties) also checks that expectedProperties exactly matches available keys in src', (t) => {
  // → false
  if (is.recordWithPropertiesExclusively(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty'])) t.fail(); // specifying extra keys => FALSE
  if (is.recordWithPropertiesExclusively(RECORD, PROPERTIES_REFERENCING_STRINGS)) t.fail(); // expectedProperties as subset of acutal keys => FALSE
  // true
  if (!is.recordWithPropertiesExclusively(RECORD, PROPERTIES)) t.fail(); // exact match between actual keys and expectedProperties => TRUE
  t.pass();
});

test('is.recordWithPropertiesAndStringValues(src, expectedProperties) checks for the expectedProperties and checks that values are strings', (t) => {
  // → false
  if (is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES)) t.fail(); // expectedProperties references string and non-string values => FALSE
  if (is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_NON_STRINGS)) t.fail(); // expectedProperties references subset of only non-string values => FALSE
  if (is.recordWithPropertiesAndStringValues(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty'])) t.fail(); // specifying extra keys => FALSE
  // true
  if (!is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_STRINGS)) t.fail(); // expectedProperties references subset of only string values => TRUE
  t.pass();
});
