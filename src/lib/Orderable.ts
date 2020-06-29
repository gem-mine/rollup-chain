type Constructor<T> = new (...args: any[]) => T

interface Mergeable {
  merge: (
    obj: any,
    omit: string[]
  ) => void;
}

function Orderable<T extends Constructor<Mergeable>>(Class: T) {
  return class OrderableClass extends Class {
    __after?: string = undefined

    __before?: string = undefined

    before(name: string) {
      if (this.__after) {
        throw new Error(
          `Unable to set .before(${JSON.stringify(
            name,
          )}) with existing value for .after()`,
        )
      }

      this.__before = name
      return this
    }

    after(name: string) {
      if (this.__before) {
        throw new Error(
          `Unable to set .after(${JSON.stringify(
            name,
          )}) with existing value for .before()`,
        )
      }

      this.__after = name
      return this
    }

    /* @ts-ignore */
    merge(obj, omit: string[] = []) {
      if (obj.before) {
        this.before(obj.before)
      }

      if (obj.after) {
        this.after(obj.after)
      }
      return super.merge(obj, [...omit, 'before', 'after'])
    }
  }
}

export default Orderable
