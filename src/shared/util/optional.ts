export class Optional<T> {

  constructor(private readonly _value?: T) {
  }

  static empty<T>(): Optional<T> {
    return new Optional<T>();
  }

  static of<T>(value: T): Optional<T> {
    if (value == undefined) {
      return Optional.empty();
    }
    return new Optional<T>(value);
  }

  isEmpty(): boolean {
    return !this._value;
  }

  isPresent(): boolean {
    return !this.isEmpty();
  }

  expect(msg: string): T {
    if (this.isEmpty()) {
      throw msg;
    }
    return this._value;
  }

  get(): T {
    return this.expect('Trying to get empty optional');
  }

  orElse(alternative: () => T): T {
    if (this.isPresent()) {
      return this._value;
    }
    return alternative();
  }

  ifPresent(ifPresentCallback: (value: T) => any) {
    if (this.isPresent()) {
      ifPresentCallback(this._value);
    }
  }
}
