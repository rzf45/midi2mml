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
