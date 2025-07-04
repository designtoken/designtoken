// core/src/registry.ts
import { SpecModule } from './types';

const REGISTRY_KEY = Symbol.for('@@designtoken/Registry');

class RegistryImpl {
  private specs = new Map<string, SpecModule>();

  registerSpec(m: SpecModule) {
    const key = `${m.id}@${m.snapshot}`;
    this.specs.set(key, m);
  }

  get(id: string, snapshot: string) {
    return this.specs.get(`${id}@${snapshot}`);
  }

  latest(id: string) {
    return [...this.specs.values()]
      .filter(m => m.id === id)
      .sort((a, b) => (a.snapshot < b.snapshot ? 1 : -1))[0];
  }
  get all() {
    return [...this.specs.values()];
  }
}

// ① reuse if it already exists, ② otherwise create & freeze
const globalAny = globalThis as any;
export const registry: RegistryImpl =
  globalAny[REGISTRY_KEY] ?? (globalAny[REGISTRY_KEY] = new RegistryImpl());

Object.freeze(registry);      // defensive: prevent accidental mutation
export type Registry = RegistryImpl;