/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

import test from 'ava';

import is from './index.mjs';

/**
 * number
 */

test('is.number(src) distinguishes number/non-number', (t) => {
  t.false(is.number({}));
  t.false(is.number('a'));
  t.false(is.number('1'));
  t.false(is.number(undefined));
  t.false(is.number(null));
  t.true(is.number(2));
  t.true(is.number(0));
  t.true(is.number(-2));
  t.pass();
});

test('is.numberOrNull(src) recognizes null as missing "number"', (t) => {
  t.false(is.numberOrNull({}));
  t.false(is.numberOrNull('a'));
  t.false(is.numberOrNull('1'));
  t.false(is.numberOrNull(undefined));
  t.true(is.numberOrNull(null));
  t.true(is.numberOrNull(2));
  t.true(is.numberOrNull(0));
  t.true(is.numberOrNull(-2));
  t.pass();
});

/**
 * string
 */

const SENTENCE = 'This is a sentence.';

test('is.string(src)', (t) => {
  t.false(is.string(2));
  t.true(is.string(''));
  t.true(is.string(SENTENCE));
  t.pass();
});

test('is.stringWithSomething(src) also requires src have non-zero length', (t) => {
  t.false(is.stringWithSomething(2));
  t.false(is.stringWithSomething(''));
  t.true(is.stringWithSomething(SENTENCE));
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
  t.false(is.stringFromDistinct('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.false(is.stringFromDistinct('', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.true(is.stringFromDistinct('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.pass();
});

test('is.stringFromDistinctOrNothing(src, distinct) also allows empty string', (t) => {
  t.false(is.stringFromDistinctOrNothing('not-an-item', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.true(is.stringFromDistinctOrNothing('', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.true(is.stringFromDistinctOrNothing('not-interested', DISTINCT_INTEREST_LEVEL_RESPONSE));
  t.pass();
});

/**
 * Array
 */

const ARRAY_OF_NUMBERS = [1, 2, 3, 4];
const ARRAY_OF_STRINGS = ['words', 'in', 'an', 'array'];

test('is.array(src) distinguishes array/non-array', (t) => {
  t.false(is.array({}));
  t.true(is.array([]));
  t.true(is.array(ARRAY_OF_STRINGS));
  t.pass();
});

test('is.arrayWithSomething(src) also expects src to have non-zero length', (t) => {
  t.false(is.arrayWithSomething({}));
  t.false(is.arrayWithSomething([]));
  t.true(is.arrayWithSomething(ARRAY_OF_STRINGS));
  t.pass();
});

test('is.arrayOfStringValues(src) also expects each element of src array to be a string', (t) => {
  t.false(is.arrayOfStringValues({}));
  t.false(is.arrayOfStringValues(ARRAY_OF_NUMBERS));
  t.true(is.arrayOfStringValues([]));
  t.true(is.arrayOfStringValues(ARRAY_OF_STRINGS));
  t.true(is.arrayOfStringValues([...ARRAY_OF_STRINGS, ''])); // note inclusion of empty string
  t.pass();
});

test('is.arrayOfStringWithSomethingValues(src) also requires strings to have non-zero length', (t) => {
  t.false(is.arrayOfStringWithSomethingValues({}));
  t.false(is.arrayOfStringWithSomethingValues(ARRAY_OF_NUMBERS));
  t.false(is.arrayOfStringWithSomethingValues([...ARRAY_OF_STRINGS, '']));
  t.true(is.arrayOfStringWithSomethingValues([]));
  t.true(is.arrayOfStringWithSomethingValues(ARRAY_OF_STRINGS));
  t.pass();
});

test('is.arrayOfNumberValues(src) also expects each element of src array to be a number', (t) => {
  t.false(is.arrayOfNumberValues({}));
  t.false(is.arrayOfNumberValues(ARRAY_OF_STRINGS));
  t.false(is.arrayOfNumberValues([...ARRAY_OF_NUMBERS, null])); // note inclusion of null
  t.true(is.arrayOfNumberValues(ARRAY_OF_NUMBERS));
  t.true(is.arrayOfNumberValues([])); // empty array => TRUE
  t.pass();
});

test('is.arrayOfNumberOrNullValues(src) also allows null elements', (t) => {
  t.false(is.arrayOfNumberOrNullValues({}));
  t.false(is.arrayOfNumberOrNullValues(ARRAY_OF_STRINGS));
  t.true(is.arrayOfNumberOrNullValues([...ARRAY_OF_NUMBERS, null]));
  t.true(is.arrayOfNumberOrNullValues(ARRAY_OF_NUMBERS));
  t.true(is.arrayOfNumberOrNullValues([]));
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
  t.false(is.record(ARRAY_OF_STRINGS));
  t.false(is.record(null));
  t.true(is.record({})); // {} is a valid record => TRUE
  t.true(is.record(RECORD));
  t.pass();
});

test('is.recordWithProperties(src, expectedProperties) also checks for the expectedProperties', (t) => {
  t.false(is.recordWithProperties(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty']));
  t.true(is.recordWithProperties(RECORD, PROPERTIES_REFERENCING_STRINGS)); // expectedProperties as subset of acutal keys should => TRUE
  t.true(is.recordWithProperties(RECORD, PROPERTIES)); // exact match between actual keys and expectedProperties => TRUE
  t.pass();
});

test('is.recordWithPropertiesExclusively(src, expectedProperties) also checks that expectedProperties exactly matches available keys in src', (t) => {
  t.false(is.recordWithPropertiesExclusively(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty'])); // specifying extra keys => FALSE
  t.false(is.recordWithPropertiesExclusively(RECORD, PROPERTIES_REFERENCING_STRINGS)); // expectedProperties as subset of acutal keys => FALSE
  t.true(is.recordWithPropertiesExclusively(RECORD, PROPERTIES)); // exact match between actual keys and expectedProperties => TRUE
  t.pass();
});

test('is.recordWithPropertiesAndStringValues(src, expectedProperties) checks for the expectedProperties and checks that values are strings', (t) => {
  t.false(is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES)); // expectedProperties references string and non-string values => FALSE
  t.false(is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_NON_STRINGS)); // expectedProperties references subset of only non-string values => FALSE
  t.false(is.recordWithPropertiesAndStringValues(RECORD, [...PROPERTIES_REFERENCING_STRINGS, 'extraProperty'])); // specifying extra keys => FALSE
  t.true(is.recordWithPropertiesAndStringValues(RECORD, PROPERTIES_REFERENCING_STRINGS)); // expectedProperties references subset of only string values => TRUE
  t.pass();
});
