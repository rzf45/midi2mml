export class AdvOpt {
  public static current: any;
  public static save(name: string) {
    if(!this.getSaveNames().includes(name)) {
      localStorage.setItem(`midi2mml::advOpt.saveNames`, JSON.stringify([...AdvOpt.getSaveNames(), name]));
    }
    localStorage.setItem(`midi2mml::advOpt.saves[${name}]`, JSON.stringify(AdvOpt.current));
  }
  public static saveCurrent() {
    localStorage.setItem(`midi2mml::advOpt.lastSave`, JSON.stringify(AdvOpt.current));
  }
  public static getSaveNames() {
    return JSON.parse(localStorage.getItem('midi2mml::advOpt.saveNames') ?? '[]');
  }
  public static loadFromSave(name: string) {
    const storageSave = localStorage.getItem(`midi2mml::advOpt.saves[${name}]`);
    if(storageSave)
      AdvOpt.current = JSON.parse(storageSave);
  }
  public static loadLastSave() {
    const storageSave = localStorage.getItem(`midi2mml::advOpt.lastSave`);
    if(storageSave)
      AdvOpt.current = JSON.parse(storageSave);
  }
}

export function advOptActive() {
  return JSON.parse(localStorage.getItem('midi2mml::advOpt.enabled') ?? 'false');
}

export function arrayLookup<T, U>(value: T, lookupArray: [T, U][], defaultValue: U | null): U | null {
  let result = defaultValue;
  for (let i = 0; i < lookupArray.length; i++) {
    if (value === lookupArray[i][0]) {
      result = lookupArray[i][1];
      break;
    }
  }
  return result;
}
