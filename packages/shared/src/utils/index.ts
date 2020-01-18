
/** Remove empty and undefined properties, returning a new copy. */
export const removeEmptyKeys = <T extends { [key: string]: any }>(obj: T): T =>
  Object.keys(obj)
    .filter(f => obj[f] != null)
    .reduce(
      (r, i) =>
        typeof obj[i] === 'object'
          ? Object.keys(obj[i]).length === 0
            ? r
            : { ...r, [i]: removeEmpty(obj[i]) } // recurse.
          : typeof obj[i] === 'undefined' || obj[i] === ''
          ? r
          : { ...r, [i]: obj[i] },
      {} as T
    );

/** Remove empty properties by mutating the original object. */
export const removeEmpty = <T>(obj: { [key: string]: any }): T => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key]);
    } else if (obj[key] === '' || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj as T;
};

export const stripSpaces = (s: string) => s.replace(/\s|,|\./g, '');
