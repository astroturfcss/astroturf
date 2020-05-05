export default function trimEnd<T>(arr: T[]): T[] {
  const result: T[] = [...arr];
  for (let i = arr.length; i--; ) {
    if (arr[i]) return result;
    result.length--;
  }
  return result;
}
