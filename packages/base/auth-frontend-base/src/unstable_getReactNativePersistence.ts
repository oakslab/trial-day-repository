/**
 * Coming from: https://github.com/firebase/firebase-js-sdk/blob/8fb372afbf21ae80bcb5ae00fdc9ab8494ceac00/packages/auth/src/platform_react_native/persistence/react_native.ts#L35
 * Because of new firebase-js-sdk exports strategy it's impossible to import this module directly.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function unstable_getReactNativePersistence(storage: any): any {
  // In the _getInstance() implementation (see src/core/persistence/index.ts),
  // we expect each "externs.Persistence" object passed to us by the user to
  // be able to be instantiated (as a class) using "new". That function also
  // expects the constructor to be empty. Since ReactNativeStorage requires the
  // underlying storage layer, we need to be able to create subclasses
  // (closures, esentially) that have the storage layer but empty constructor.
  return class {
    static type = 'LOCAL' as const;
    readonly type: any = 'LOCAL';

    async _isAvailable(): Promise<boolean> {
      try {
        if (!storage) {
          return false;
        }
        await storage.setItem('__sak', '1');
        await storage.removeItem('__sak');
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: any): Promise<void> {
      return storage.setItem(key, JSON.stringify(value));
    }

    async _get(key: string): Promise<any | null> {
      const json = await storage.getItem(key);
      return json ? JSON.parse(json) : null;
    }

    _remove(key: string): Promise<void> {
      return storage.removeItem(key);
    }

    _addListener(_key: string, _listener: any): void {
      // Listeners are not supported for React Native storage.
      return;
    }

    _removeListener(_key: string, _listener: any): void {
      // Listeners are not supported for React Native storage.
      return;
    }
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
