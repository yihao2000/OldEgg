export const LAPTOP_NAME_CONVERTER = (rawname: string) => {
  var name = rawname.split('_').join(' ');
  var lastIndex = name.lastIndexOf(' ');
  name = name.substring(0, lastIndex);
  var lastIndex = name.lastIndexOf(' ');
  name = name.substring(0, lastIndex);
  return name;
};
