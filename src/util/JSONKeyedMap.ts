class JSONKeyedMap<K extends ReadonlyArray<any> | object, V>
  implements Map<K, V>
{
  private map: Map<string, V> = new Map();

  has(key: K): boolean {
    return this.map.has(JSON.stringify(key));
  }

  get(key: K): V | undefined {
    return this.map.get(JSON.stringify(key));
  }

  set(key: K, value: V): this {
    this.map.set(JSON.stringify(key), value);
    return this;
  }

  get size(): number {
    return this.map.size;
  }

  delete(key: K): boolean {
    return this.map.delete(JSON.stringify(key));
  }

  clear(): void {
    this.map.clear();
  }

  *keys(): IterableIterator<K> {
    for (const k of this.map.keys()) {
      yield JSON.parse(k);
    }
  }

  values(): IterableIterator<V> {
    return this.map.values();
  }

  *entries(): IterableIterator<[K, V]> {
    for (const [k, v] of this.map.entries()) {
      yield [JSON.parse(k), v];
    }
  }

  forEach(
    callbackfn: (value: V, key: K, map: JSONKeyedMap<K, V>) => void
  ): void {
    for (const [k, v] of this.entries()) {
      callbackfn(v, k, this);
    }
  }

  [Symbol.iterator] = this.entries;
  [Symbol.toStringTag] = this.map[Symbol.toStringTag];
}

export default JSONKeyedMap;
