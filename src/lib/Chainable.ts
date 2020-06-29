/**
 * this file comes from `webpack-chain`
 */
class Chainable {
  parent

  constructor(parent?: any) {
    this.parent = parent
  }

  batch(handler) {
    handler(this)
    return this
  }

  end() {
    return this.parent
  }
}

export default Chainable
