import {cDataClass} from '../cDataClass';

export class cUserData {
  updateKey?: string;
  staffCode?: string; //SyokuinCode
  firstName?: string; //NameSei
  lastName?: string; //NameMei
  firstNameF?: string; //NameSeiF
  lastNameF?: string; //NameMeiF
  password?: string;
  validFlag?: string; //YukoFlag
  recordDeleteInfo?: string; //RecordSakujyoJyoho
  isBuildingBoss?: string; //IsSisetutyo
  isDoctor?: string; //IsIshi
  isCarerSpecialist?: string; //IsKaigoshienSenmonin
  isCarer?: string; //IsKangoshi
  isInformerPerson?: string; //IsRyohoushi
  isNurse?: string; //IsKaigoin
  isAdvisor?: string; //IsShienSoudanin
  isNutritionistManager?: string; //IsKanriEiyoshi
  isOtherRole?: string; //IsSonota

  constructor(dict?: {[key: string]: any}) {
    if (dict) {
      this.staffCode = dict['職員コード'] || '';
      this.firstName = dict['職員名称_姓'] || '';
      this.lastName = dict['職員名称_名'] || '';
      this.firstNameF = dict['職員名称_姓F'] || '';
      this.lastNameF = dict['職員名称_名F'] || '';
      this.password = dict['パスワード'] || '';
      this.validFlag = dict['有効フラグ'] || '';
      this.recordDeleteInfo = dict['レコード削除情報'] || '';
      this.isBuildingBoss = dict['職種_施設長'] || '';
      this.isDoctor = dict['職種_医師'] || '';
      this.isCarerSpecialist = dict['職種_介護支援専門員'] || '';
      this.isInformerPerson = dict['職種_療法士'] || '';
      this.isCarer = dict['職種_看護師'] || '';
      this.isNurse = dict['職種_介護員'] || '';
      this.isAdvisor = dict['職種_支援相談員'] || '';
      this.isNutritionistManager = dict['職種_管理栄養士'] || '';
      this.isOtherRole = dict['職種_その他'] || '';
    }
  }

  getUserData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    this.staffCode = parser.getDataValueFromKeyAndTargetArray('職員コード', ad);
    this.firstName = parser.getDataValueFromKeyAndTargetArray(
      '職員名称_姓',
      ad,
    );
    this.lastName = parser.getDataValueFromKeyAndTargetArray('職員名称_名', ad);
    this.firstNameF = parser.getDataValueFromKeyAndTargetArray(
      '職員名称_姓F',
      ad,
    );
    this.lastNameF = parser.getDataValueFromKeyAndTargetArray(
      '職員名称_名F',
      ad,
    );
    this.password = parser.getDataValueFromKeyAndTargetArray('パスワード', ad);
    this.validFlag = parser.getDataValueFromKeyAndTargetArray('有効フラグ', ad);
    this.recordDeleteInfo = parser.getDataValueFromKeyAndTargetArray(
      'レコード削除情報',
      ad,
    );
    this.isBuildingBoss = parser.getDataValueFromKeyAndTargetArray(
      '職種_施設長',
      ad,
    );
    this.isDoctor = parser.getDataValueFromKeyAndTargetArray('職種_医師', ad);
    this.isCarerSpecialist = parser.getDataValueFromKeyAndTargetArray(
      '職種_介護支援専門員',
      ad,
    );
    this.isInformerPerson = parser.getDataValueFromKeyAndTargetArray(
      '職種_療法士',
      ad,
    );
    this.isCarer = parser.getDataValueFromKeyAndTargetArray('職種_看護師', ad);
    this.isNurse = parser.getDataValueFromKeyAndTargetArray('職種_介護員', ad);
    this.isAdvisor = parser.getDataValueFromKeyAndTargetArray(
      '職種_支援相談員',
      ad,
    );
    this.isNutritionistManager = parser.getDataValueFromKeyAndTargetArray(
      '職種_管理栄養士',
      ad,
    );
    this.isOtherRole = parser.getDataValueFromKeyAndTargetArray(
      '職種_その他',
      ad,
    );
  }

  getUserNameString() {
    return `${this.firstName} ${this.lastName}`;
  }

  userSyokusyuString() {
    if (this.isBuildingBoss === '1') {
      return '施設長';
    }
    if (this.isDoctor === '1') {
      return '医師';
    }
    if (this.isCarerSpecialist === '1') {
      return '介護支援専門員';
    }
    if (this.isCarer === '1') {
      return '看護師';
    }
    if (this.isInformerPerson === '1') {
      return '療法士';
    }
    if (this.isNurse === '1') {
      return '介護員';
    }
    if (this.isAdvisor === '1') {
      return '支援相談員';
    }
    if (this.isNutritionistManager === '1') {
      return '管理栄養士';
    }
    if (this.isOtherRole === '1') {
      return 'その他';
    }
    return '';
  }
  getJobs() {
    let jobs: string[] = [];
    if (this.isBuildingBoss === '1') {
      jobs.push('施設長');
    }
    if (this.isDoctor === '1') {
      jobs.push('医師');
    }
    if (this.isCarerSpecialist === '1') {
      jobs.push('介護支援専門員');
    }
    if (this.isCarer === '1') {
      jobs.push('看護師');
    }
    if (this.isInformerPerson === '1') {
      jobs.push('療法士');
    }
    if (this.isNurse === '1') {
      jobs.push('介護員');
    }
    if (this.isAdvisor === '1') {
      jobs.push('支援相談員');
    }
    if (this.isNutritionistManager === '1') {
      jobs.push('管理栄養士');
    }
    if (this.isOtherRole === '1') {
      jobs.push('その他');
    }
    return jobs;
  }
}
