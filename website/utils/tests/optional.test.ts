import { describe, expect, it, vi } from 'vitest';
import { Optional } from '../optional';

describe('Optional', () => {
    describe('empty', () => {
        it('creates an empty optional', () => {
            expect(Optional.empty().isEmpty()).toBe(true);
        });
    });

    describe('of', () => {
        it('creates empty optional for undefined param', () => {
            const testee = Optional.of();

            expect(testee.isEmpty()).toBe(true);
        });

        it('creates empty optional for null param', () => {
            const testee = Optional.of(null);

            expect(testee.isEmpty()).toBe(true);
        });

        it('creates present optional for defined param', () => {
            const testee = Optional.of('foo');

            expect(testee.isPresent()).toBe(true);
        });
    });

    describe('get', () => {
        it('returns value if present', () => {
            const value = 'foo';
            const testee = Optional.of(value);

            const actual = testee.get();

            expect(actual).toBe(value);
        });

        it('throws exception if empty', () => {
            const testee = Optional.of();

            expect(() => testee.get()).toThrow();
        });
    });

    describe('expect', () => {
        it('returns value if present', () => {
            const value = 'foo';
            const testee = Optional.of(value);

            const actual = testee.expect('my error message');

            expect(actual).toBe(value);
        });

        it('throws exception if empty', () => {
            const testee = Optional.of();

            expect(() => testee.expect('my error message')).toThrow(/.*my error message.*/);
        });
    });

    describe('orElse', () => {
        it('returns the value if present', () => {
            const value = 'foo';
            const alternative = 'bar';
            const testee = Optional.of(value);

            const actual = testee.orElse(() => alternative);

            expect(actual).toBe(value);
        });

        it('returns the result of the alternative supplier if empty', () => {
            const alternative = 'bar';
            const testee = Optional.empty();

            const actual = testee.orElse(() => alternative);

            expect(actual).toBe(alternative);
        });
    });

    describe('ifPresent', () => {
        it('executes the callback if present', () => {
            const mockCallback = vi.fn();
            const testee = Optional.of('foo');

            testee.ifPresent(mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('does not execute the callback if empty', () => {
            const mockCallback = vi.fn();
            const testee = Optional.empty();

            testee.ifPresent(mockCallback);

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
