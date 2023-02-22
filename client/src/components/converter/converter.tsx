import { ProductDetail } from '../interfaces/interfaces';

export const LAPTOP_NAME_CONVERTER = (rawname: string) => {
  var name = rawname.split('_').join(' ');
  var lastIndex = name.lastIndexOf(' ');
  name = name.substring(0, lastIndex);
  var lastIndex = name.lastIndexOf(' ');
  name = name.substring(0, lastIndex);
  return name;
};

export const LAPTOP_COMPONENTS_CONVERTER = (rawname: string) => {
  var name: string[] = rawname.split('_');

  return name;
};

export const GET_LAPTOP_COMPONENT_VARIANT = (variantList: ProductDetail[]) => {
  var variantCount: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (var i = 0; i < variantList.length; i++) {
    for (var j = 0; j < variantList.length; j++) {
      for (var l = 0; l < variantList[i].components.length; l++) {
        if (variantList[i].components[l] != variantList[j].components[l]) {
          variantCount[l] = variantCount[l] + 1;
        }
      }
    }
  }

  return variantCount;
};

export const NAME_SPLITTER = (fullname: string) => {
  return fullname.match(/[A-Z][a-z]+/g);
};
