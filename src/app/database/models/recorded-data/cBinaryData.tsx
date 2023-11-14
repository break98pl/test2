export class cBinaryData {
  updateDate?: string;
  UpdateKey?: string;
  fileName?: string;
  photoKey?: string;
  photoData?: string;
  updateUserString?: string;
  createDate?: string;
  newFlag?: string; // shinkiFuragu
  updateFlag?: string; // henkoFuragu
  latestDatetime?: string; // saishinNichiji
  updateDict?: {[key: string]: any};
  fkKey?: string;

  constructor() {}

  getUpdateDict() {
    this.updateDict = {};

    if (this.updateDate) {
      if (this.updateDate !== '') {
        this.updateDict['レコード更新情報'] = this.updateDate;
      }
    }
    if (this.UpdateKey) {
      if (this.UpdateKey !== '') {
        this.updateDict['更新キー'] = this.UpdateKey;
      }
    }
    if (this.updateUserString) {
      if (this.updateUserString !== '') {
        this.updateDict['更新ユーザー情報'] = this.updateUserString;
      }
    }
    if (this.photoKey) {
      if (this.photoKey !== '') {
        this.updateDict['キー'] = this.photoKey;
      }
    }
    if (this.photoData) {
      if (this.photoData !== '') {
        this.updateDict['データ'] = this.photoData;
      }
    }
    if (this.createDate) {
      if (this.createDate !== '') {
        this.updateDict['レコード作成情報'] = this.createDate;
      }
    }
    if (this.updateFlag) {
      if (this.updateFlag !== '') {
        this.updateDict['変更フラグ'] = this.updateFlag;
      }
    }
    if (this.newFlag) {
      if (this.newFlag !== '') {
        this.updateDict['新規フラグ'] = this.newFlag;
      }
    }
    if (this.latestDatetime) {
      if (this.latestDatetime !== '') {
        this.updateDict['最新日時'] = this.latestDatetime;
      }
    }

    return this.updateDict;
  }

  // キーの値
  // getPhotoKey(phtKey: string) {
  //   const strKey = '';
  //   // [strKey appendString:@"支援経過_写真_"];
  //   // [strKey appendString:[NSString stringWithFormat:@"%@_",phtKey]];
  //   // strKey = [self createPhotokey:strKey pk_key:phtKey];
  //   return strKey;
  // }

  //本人写真 キーの値
  // getTenantPhotoKey(phtKey: string) {
  //   const strKey = '';
  //   // [strKey appendString:@"利用者_"];
  //   // [strKey appendString:[NSString stringWithFormat:@"%@_本人写真_",phtKey]];
  //   // strKey = [self createPhotokey:strKey pk_key:phtKey];
  //   return strKey;
  // }

  // createPhotokey(targetString: string, pk_key: string) {
  //   // UIDevice *dev = [UIDevice currentDevice];
  //   // NSString *strDevBuff = dev.name;
  //   // strDevBuff = [(NSString *)strDevBuff stringByReplacingOccurrencesOfString:@"'" withString:@"’"];
  //   // strDevBuff =[strDevBuff stringByReplacingOccurrencesOfString:@"'" withString:@"’"];
  //   // NSMutableString *strDev = [NSMutableString stringWithString:strDevBuff];
  //   // [targetString appendString:strDev];
  //   // [targetString appendString:@"_"];
  //   // NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  //   // [dateFormatter setLocale:[NSLocale systemLocale]];
  //   // [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"JST"]];
  //   // [dateFormatter setDateFormat:@"yyyyMMddHHmmss"];
  //   // NSString *strDate = [dateFormatter stringFromDate:[NSDate date]];
  //   // [targetString appendString:strDate];
  //   // return targetString;
  // }

  // imageをバイナリ文字列に変換
  // getStringDataFromBinary(iBinary: any) {
  //   // if ([iBinary length] < 1) {
  //   //     return @"";
  //   // }
  //   // NSMutableString *strBuf = [NSMutableString string];
  //   // unsigned char *byteData = (unsigned char *)[iBinary bytes];
  //   // int i, n;
  //   // NSMutableString *strForm = [NSMutableString string];
  //   // for (i = 0; i < 32; i++) {
  //   //     [strForm appendString:@"%02x"];
  //   // }
  //   // for (n = 0; n < [iBinary length]; n+=32) {
  //   //     NSString *strHex = [NSString stringWithFormat:strForm
  //   //                         ,byteData[n],byteData[n+1],byteData[n+2],byteData[n+3],byteData[n+4],byteData[n+5],byteData[n+6],byteData[n+7]
  //   //                         ,byteData[n+8],byteData[n+9],byteData[n+10],byteData[n+11],byteData[n+12],byteData[n+13],byteData[n+14],byteData[n+15]
  //   //                         ,byteData[n+16],byteData[n+17],byteData[n+18],byteData[n+19],byteData[n+20],byteData[n+21],byteData[n+22],byteData[n+23]
  //   //                         ,byteData[n+24],byteData[n+25],byteData[n+26],byteData[n+27],byteData[n+28],byteData[n+29],byteData[n+30],byteData[n+31]];
  //   //     [strBuf appendString:strHex];
  //   // }
  //   // for (i = n; i < [iBinary length]; i++) {
  //   //     NSString *strHex = [NSString stringWithFormat:@"%02x",byteData[i]];
  //   //     [strBuf appendString:strHex];
  //   // }
  //   // return strBuf;
  // }
}
