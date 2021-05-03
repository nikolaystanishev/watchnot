export const createArrayFromSize = (size: number | string): string[] => {
  return Array.from({ length: Number(size) }, (_, i) => (i + 1).toString());
}
