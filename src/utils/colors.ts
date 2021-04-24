export const hashCode = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
};

export const hashToHexCode = (hash: number) => {
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - color.length) + color;
};

export const getHexfromString = (str: string) =>
  '#' + hashToHexCode(hashCode(str));
