import {cElapsedDataShisetsu} from './cElapsedDataShisetsu';

export class cElapsedData extends cElapsedDataShisetsu {
  apUpdateKey?: string;

  getUpdateDict() {
    this.updateDict = super.getUpdateDict();
    if (this.serviceType) {
      this.updateDict['サービス種類'] = this.serviceType;
    }
    if (this.apUpdateKey) {
      this.updateDict['AP_更新キー'] = this.apUpdateKey;
    }
    return this.updateDict;
  }
}
