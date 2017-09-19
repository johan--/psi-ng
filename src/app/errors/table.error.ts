// see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
export class TableError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, TableError.prototype);
  }

  public nodesLevelsAreIncompatibleToBeMerged() {
    return (this.message ? `Nodes levels are incompatible to be merged. ${this.message}` : 'Nodes levels are incompatible to be merged.');
  }
}