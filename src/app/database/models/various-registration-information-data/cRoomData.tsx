// import {cDataClass} from '../cDataClass';

export class cRoomData {
  code: string;
  displayVersion: string; //?HyojiyoTsuBan
  bedCategory1: string; //BedKubun1
  bedCategory2: string; //BedKubun2
  bedCategory3: string; //BedKubun3
  bedCategory4: string; //BedKubun4
  numberOfPeople: string; //Ninzu
  rent: string; //?Yatin
  buildingCode: string; //TouCode
  buildingName: string; //Toumei
  roomName: string; //Heyameisyo
  notes: string; //Bikou: it is unit

  constructor() {
    this.code = '';
    this.displayVersion = '';
    this.bedCategory1 = '';
    this.bedCategory2 = '';
    this.bedCategory3 = '';
    this.bedCategory4 = '';
    this.numberOfPeople = '';
    this.rent = '';
    this.buildingCode = '';
    this.buildingName = '';
    this.roomName = '';
    this.notes = '';
  }

  // /**
  //  * getRoomData() is only available for shisetsu in old source
  //  */
  // getRoomData(ad: cDataClass[]) {
  //   const parser: cDataClass = new cDataClass();
  //
  //   this.code = parser.getDataValueFromKeyAndTargetArray('コード', ad);
  //   this.displayVersion = parser.getDataValueFromKeyAndTargetArray(
  //     '表示用通番',
  //     ad,
  //   );
  //   this.bedCategory1 = parser.getDataValueFromKeyAndTargetArray(
  //     'ベッド区分1',
  //     ad,
  //   );
  //   this.bedCategory2 = parser.getDataValueFromKeyAndTargetArray(
  //     'ベッド区分2',
  //     ad,
  //   );
  //   this.bedCategory3 = parser.getDataValueFromKeyAndTargetArray(
  //     'ベッド区分3',
  //     ad,
  //   );
  //   this.bedCategory4 = parser.getDataValueFromKeyAndTargetArray(
  //     'ベッド区分4',
  //     ad,
  //   );
  //   this.numberOfPeople = parser.getDataValueFromKeyAndTargetArray('人数', ad);
  //   this.rent = parser.getDataValueFromKeyAndTargetArray('家賃', ad);
  //   this.buildingCode = parser.getDataValueFromKeyAndTargetArray(
  //     '棟コード',
  //     ad,
  //   );
  //   this.buildingName = parser.getDataValueFromKeyAndTargetArray('棟名', ad);
  //   this.roomName = parser.getDataValueFromKeyAndTargetArray('部屋名称', ad);
  //   this.notes = parser.getDataValueFromKeyAndTargetArray('備考', ad);
  // }

  // /**
  //  * getFloor() is only available for shisetsu in old source
  //  */
  // getFloor() {
  //   if (this.code && this.code.length > 2) {
  //     return this.code[1];
  //   } else {
  //     return 0;
  //   }
  // }

  parseFromRawData(record: Record<string, string | null>) {
    this.code = record['コード'] ?? '';
    this.displayVersion = record['表示用通番'] ?? '';
    this.bedCategory1 = record['ベッド区分1'] ?? '';
    this.bedCategory2 = record['ベッド区分2'] ?? '';
    this.bedCategory3 = record['ベッド区分3'] ?? '';
    this.bedCategory4 = record['ベッド区分4'] ?? '';
    this.numberOfPeople = record['人数'] ?? '';
    this.rent = record['家賃'] ?? '';
    this.buildingCode = record['棟コード'] ?? '';
    this.buildingName = record['棟名'] ?? '';
    this.roomName = record['部屋名称'] ?? '';
    this.notes = record['備考'] ?? '';
  }
}
