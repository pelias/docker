/**
 * Create an error from multiple errors.
 */
export default class AggregateError extends Error implements Iterable<Error> {
	readonly name: 'AggregateError';

	/**
	 * @param errors - If a string, a new `Error` is created with the string as the error message. If a non-Error object, a new `Error` is created with all properties from the object copied over.
	 * @returns An Error that is also an [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables) for the individual errors.
	 */
	constructor(errors: ReadonlyArray<Error | {[key: string]: unknown} | string>);

	[Symbol.iterator](): IterableIterator<Error>;
}
