// export enum DATE_TYPE {
//   DATE_YMDT = 0,
//   DATE_YMD = 1,
//   DATE_T = 2,
// }

export class cDataClass {
  KeyName?: string;
  DataValue?: string;

  constructor() {
    this.KeyName = '';
    this.DataValue = '';
  }

  // initWithNameAndDataValue(n: string, desc: string) {
  //   this.KeyName = n;
  //   this.DataValue = desc;
  // }

  getDataValueFromKeyAndTargetArray(keyStr: string, targetArray: cDataClass[]) {
    let result: string | undefined = '';
    targetArray.forEach(item => {
      if (item.KeyName === keyStr) {
        result = item.DataValue;
      }
    });
    return result;
  }

  hexToBytes(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i !== bytes.length; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }

  stringFromHex(hex: string) {
    return new TextDecoder('UTF-8').decode(this.hexToBytes(hex));
  }

  toStringFromHexString(str: string) {
    const array = str.split('&c_');
    const wStr = array.join('');
    return this.stringFromHex(wStr);
  }

  dateStringToYMDT(str: string) {
    return str.substring(0, 10);
  }

  dateStringToTime(str: string) {
    const array = str.split('T');
    if (array.length === 2) {
      return array[1].substring(0, 5);
    }
    return '00:00';
  }
}
