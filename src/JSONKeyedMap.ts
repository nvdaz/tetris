class ArrayKeyedMap<K extends ReadonlyArray<any>, V> extends Map<K, V> {
  constructor() {
    super();
    this[Symbol.iterator] = this.entries;
  }

  get(key: K): V | undefined {
    super.get(JSON.stringify(key));
  }

  *entries(): IterableIterator<[K, V]> {
    for (let [k, v] of super.entries()) {
      yield [JSON.parse(k), v];
    }
  }

  set(key: K, value: V): this {
    return super.set(JSON.stringify(key), value);
  }

  delete(key: K): boolean {
    return super.delete(JSON.stringify(key));
  }
}

export default ArrayKeyedMap;
