export const ApiURL = (path: string) => {
  const api = 'http://localhost:8080/api';
  return api + path;
};
export const WsUrl = (path: string) => {
  const api = 'ws://localhost:8080/api';
  return api + path;
};

// export const CloudinaryURL = () => {
//   return `https://api.cloudinary.com/v1_1/${
//     import.meta.env.VITE_CLOUDINARY_NAME
//   }/auto/upload`;
// };

export const HasWhiteSpace = (str: string) => {
  return /\s/.test(str);
};
