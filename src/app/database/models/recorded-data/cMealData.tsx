import {DBOperation} from '@modules/operation/operation.service';
import {
  cUserControls,
  OvernightData,
} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';
import {cMealManagementData} from '../various-registration-information-data/cMealManagementData';
import {cTenantData} from '../various-registration-information-data/cTenantData';
import {cUserData} from '../various-registration-information-data/cUserData';
import {cVitalControlData} from '../various-registration-information-data/cVitalControlData';
import {cSuperReportDataClass} from './cSuperReportDataClass';

export enum mealType {
  MTYPE_NONE, //未設定
  MTYPE_MEAL, //朝食、昼食、夕食
  MTYPE_SNACK, //AMおやつ、PMおやつ
  MTYPE_DRINK, //その他水分摂取
}

export class cMealData extends cSuperReportDataClass {
  updateUser?: string; //更新者 - UpdateUser
  userName?: string; //利用者名 - RiyosyaMei
  targetDate?: string; //対象年月日 - TaisyoNengappi
  eatingTime?: string; //食事摂取_時刻 - SessyuJikoku
  eatingClassification?: string; //食事摂取区分 - Syokujisesyu_Kubun
  eatingStapleFood?: string; //主食 - Syokuji_Syusyoku
  eatingAdditionalFood?: string; //副食 - Syokuji_Fukusyoku
  eatingSoup?: string; //汁物 - Syokuji_Sirumono
  eatingTea?: string; //お茶類 - Syokuji_Otyarui
  snackSnack?: string; //おやつ - Oyatsu_Oyatsu
  snackDrink?: string; //おやつの見物 - Oyatsu_Nomimono
  otherDrinkTime?: string; //その他水分摂取_時刻 - SonotaSuibun_Jikoku
  otherDrinkMoisture?: string; //その他水分摂取_水分 - SonotaSuibun_Suibun
  otherDrinkMoistureContent?: string; //その他水分摂取_内容 - SonotaSuibun_Naiyo
  memo?: string; //メモ
  staffCode?: string; //職員コード - SyokuinCode
  staffName?: string; //職員名 - SyokuinMei

  myTenantData?: cTenantData; //テナントデータ
  kanaName?: string; //kana_simei
  sortKeyRoomCodeKana?: string; //
  roomName?: string; // kita2011/12/12 //heyameisyo
  isEdited?: boolean; //IsEdited
  isStop?: boolean; //IsStop
  nowStatusOvernight?: OvernightData; //NowStatus_GAISYUTUGAIHAKU
  nowEatingLableData?: cMealManagementData; //NowSyokujiSenData
  NowSyokujiRenrakuData?: cMealManagementData;
  IsIkkatsu?: boolean;

  constructor() {
    super();
  }

  strTargetDate() {
    return this.targetDate;
  }

  setStrTargetDate(strTargetDate: string) {
    this.targetDate = strTargetDate;
  }

  GetUpdateDict() {
    this.updateDict = {};
    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.userName) {
      this.updateDict['利用者名'] = this.userName;
    }

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }

    if (this.targetDate) {
      this.updateDict['対象年月日'] = this.targetDate;
    }

    if (this.eatingTime) {
      this.updateDict['食事摂取_時刻'] = this.eatingTime;
    }

    if (this.eatingClassification) {
      this.updateDict['食事摂取_区分'] = this.eatingClassification;
    }

    if (this.eatingStapleFood) {
      this.updateDict['食事_主食'] = this.eatingStapleFood;
    }

    if (this.eatingAdditionalFood) {
      this.updateDict['食事_副食'] = this.eatingAdditionalFood;
    }

    if (this.eatingSoup) {
      this.updateDict['食事_汁物'] = this.eatingSoup;
    }

    if (this.eatingTea) {
      this.updateDict['食事_お茶類'] = this.eatingTea;
    }

    if (this.snackSnack) {
      this.updateDict['おやつ_おやつ'] = this.snackSnack;
    }

    if (this.snackDrink) {
      this.updateDict['おやつ_飲み物'] = this.snackDrink;
    }

    if (this.otherDrinkTime) {
      this.updateDict['その他水分摂取_時刻'] = this.otherDrinkTime;
    }

    if (this.otherDrinkMoisture) {
      this.updateDict['その他水分摂取_水分'] = this.otherDrinkMoisture;
    }

    if (this.otherDrinkMoistureContent) {
      this.updateDict['その他水分摂取_内容'] = this.otherDrinkMoistureContent;
    }

    if (this.staffCode) {
      this.updateDict['職員コード'] = this.staffCode;
    }

    if (this.staffName) {
      this.updateDict['職員名'] = this.staffName;
    }

    if (this.memo) {
      this.updateDict['メモ'] = this.memo;
    }

    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }

    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }

    if (this.serviceType) {
      this.updateDict['サービス種類'] = this.serviceType;
    }

    if (this.strSendErrMsg) {
      this.updateDict['送信エラー'] = this.strSendErrMsg;
    }

    if (this.expireDate) {
      this.updateDict['掲載期限日'] = this.expireDate;
    }

    this.updateDict['期間_選択項目'] = this.viewingPeriod;

    return this.updateDict;
  }

  tableName() {
    return 'T_日常業務_食事摂取記録';
  }

  GetMealData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);

    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.userName = parser.getDataValueFromKeyAndTargetArray('利用者名', ad);
    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.userName = parser.getDataValueFromKeyAndTargetArray('利用者名', ad);
    this.targetDate = parser.getDataValueFromKeyAndTargetArray(
      '対象年月日',
      ad,
    );
    this.eatingTime = parser.getDataValueFromKeyAndTargetArray(
      '食事摂取_時刻',
      ad,
    );
    this.eatingClassification = parser.getDataValueFromKeyAndTargetArray(
      '食事摂取_区分',
      ad,
    );
    this.eatingStapleFood = parser.getDataValueFromKeyAndTargetArray(
      '食事_主食',
      ad,
    );
    this.eatingAdditionalFood = parser.getDataValueFromKeyAndTargetArray(
      '食事_副食',
      ad,
    );
    this.eatingSoup = parser.getDataValueFromKeyAndTargetArray('食事_汁物', ad);
    this.eatingTea = parser.getDataValueFromKeyAndTargetArray(
      '食事_お茶類',
      ad,
    );
    this.snackSnack = parser.getDataValueFromKeyAndTargetArray(
      'おやつ_おやつ',
      ad,
    );
    this.snackDrink = parser.getDataValueFromKeyAndTargetArray(
      'おやつ_飲み物',
      ad,
    );
    this.otherDrinkTime = parser.getDataValueFromKeyAndTargetArray(
      'その他水分摂取_時刻',
      ad,
    );
    this.otherDrinkMoisture = parser.getDataValueFromKeyAndTargetArray(
      'その他水分摂取_水分',
      ad,
    );
    this.otherDrinkMoistureContent = parser.getDataValueFromKeyAndTargetArray(
      'その他水分摂取_内容',
      ad,
    );
    this.memo = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('メモ', ad),
    );
    this.staffCode = parser.getDataValueFromKeyAndTargetArray('職員コード', ad);
    this.staffName = parser.getDataValueFromKeyAndTargetArray('職員名', ad);
    this.serviceType = parser.getDataValueFromKeyAndTargetArray(
      'サービス種類',
      ad,
    );
    this.expireDate = parser.getDataValueFromKeyAndTargetArray(
      '掲載期限日',
      ad,
    );
    this.viewingPeriod = parseInt(
      parser.getDataValueFromKeyAndTargetArray('期間_選択項目', ad),
      10,
    );
    this.ASUpdateKey = parser.getDataValueFromKeyAndTargetArray(
      'AP_更新キー',
      ad,
    );

    this.reporterData = new cUserData();
    this.reporterData.getUserData(ad);
  }

  SetJSONArray() {
    const postArrayObjects: any[] = [];
    const postArrayKeys: string[] = [];

    if (
      this.updateKey.length !== 0 &&
      this.updateKey !== '' &&
      this.newFlag !== '1'
    ) {
      postArrayObjects.push(this.updateKey);
      postArrayKeys.push('更新キー');
    }

    if (this.fkKey) {
      postArrayObjects.push(this.fkKey);
      postArrayKeys.push('FK_利用者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('FK_利用者');
    }

    if (this.userName.length !== 0 && this.userName !== '') {
      postArrayObjects.push(this.userName);
      postArrayKeys.push('利用者名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('利用者名');
    }

    if (this.targetDate.length !== 0 && this.targetDate !== '') {
      postArrayObjects.push(this.targetDate);
      postArrayKeys.push('対象年月日');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('対象年月日');
    }

    if (this.eatingTime.length !== 0 && this.targetDate !== '') {
      postArrayObjects.push(this.eatingTime);
      postArrayKeys.push('食事摂取_時刻');
    }

    if (
      this.eatingClassification.length !== 0 &&
      this.eatingClassification !== ''
    ) {
      postArrayObjects.push(this.eatingClassification);
      postArrayKeys.push('食事摂取_区分');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('食事摂取_区分');
    }

    if (this.eatingStapleFood.length !== 0 && this.eatingStapleFood !== '') {
      postArrayObjects.push(this.eatingStapleFood);
      postArrayKeys.push('食事_主食');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('食事_主食');
    }

    if (
      this.eatingAdditionalFood.length !== 0 &&
      this.eatingAdditionalFood !== ''
    ) {
      postArrayObjects.push(this.eatingAdditionalFood);
      postArrayKeys.push('食事_副食');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('食事_副食');
    }

    if (this.eatingSoup.length !== 0 && this.eatingSoup !== '') {
      postArrayObjects.push(this.eatingSoup);
      postArrayKeys.push('食事_汁物');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('食事_汁物');
    }

    if (this.eatingTea.length !== 0 && this.eatingTea !== '') {
      postArrayObjects.push(this.eatingTea);
      postArrayKeys.push('食事_お茶類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('食事_お茶類');
    }

    if (this.snackSnack.length !== 0 && this.snackSnack !== '') {
      postArrayObjects.push(this.snackSnack);
      postArrayKeys.push('おやつ_おやつ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('おやつ_おやつ');
    }

    if (this.snackDrink.length !== 0 && this.snackDrink !== '') {
      postArrayObjects.push(this.snackDrink);
      postArrayKeys.push('おやつ_飲み物');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('おやつ_飲み物');
    }

    if (this.otherDrinkTime.length !== 0 && this.otherDrinkTime !== '') {
      postArrayObjects.push(this.otherDrinkTime);
      postArrayKeys.push('その他水分摂取_時刻');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('その他水分摂取_時刻');
    }

    if (
      this.otherDrinkMoisture.length !== 0 &&
      this.otherDrinkMoisture !== ''
    ) {
      postArrayObjects.push(this.otherDrinkMoisture);
      postArrayKeys.push('その他水分摂取_水分');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('その他水分摂取_水分');
    }

    if (
      this.otherDrinkMoistureContent.length !== 0 &&
      this.otherDrinkMoistureContent !== ''
    ) {
      postArrayObjects.push(this.otherDrinkMoistureContent);
      postArrayKeys.push('その他水分摂取_内容');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('その他水分摂取_内容');
    }

    if (this.memo.length !== 0 && this.memo !== '') {
      postArrayObjects.push(this.memo);
      postArrayKeys.push('メモ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('メモ');
    }

    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    if (this.staffCode.length !== 0 && this.staffCode !== '') {
      postArrayObjects.push(this.staffCode);
      postArrayKeys.push('職員コード');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員コード');
    }

    if (this.staffName.length !== 0 && this.staffName !== '') {
      postArrayObjects.push(this.staffName);
      postArrayKeys.push('職員名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員名');
    }
    if (this.serviceType.length !== 0 && this.serviceType !== '') {
      postArrayObjects.push(this.serviceType);
      postArrayKeys.push('サービス種類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('サービス種類');
    }

    if (this.expireDate) {
      postArrayObjects.push(this.expireDate);
      postArrayKeys.push('掲載期限日');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('掲載期限日');
    }

    if (this.viewingPeriod >= 0) {
      postArrayObjects.push(`${this.viewingPeriod}`);
      postArrayKeys.push('期間_選択項目');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('期間_選択項目');
    }

    return [postArrayObjects, postArrayKeys];
  }

  SyokujiJikan() {
    const parser: cDataClass = new cDataClass();

    let DateString = '';

    DateString = `${parser.dateStringToYMDT(this.targetDate)}`;
    DateString = `${DateString}T`;

    if (this.eatingClassification === '朝食') {
      DateString = `${DateString}07:00`;
    } else if (this.eatingClassification === 'amおやつ') {
      DateString = `${DateString}10:00`;
    } else if (this.eatingClassification === '昼食') {
      DateString = `${DateString}12:00`;
    } else if (this.eatingClassification === 'pmおやつ') {
      DateString = `${DateString}15:00`;
    } else if (this.eatingClassification === '夕食') {
      DateString = `${DateString}18:00`;
    } else if (this.eatingClassification === 'その他水分摂取') {
      DateString = `${DateString}${parser.dateStringToTime(
        this.otherDrinkTime,
      )}`;
    }

    return DateString;
  }

  HyojiString_Syusyoku() {
    const s = '';
    if (this.eatingStapleFood === '100') {
      return '完食';
    } else if (this.eatingStapleFood === '90') {
      return '90%';
    } else if (this.eatingStapleFood === '80') {
      return '80%';
    } else if (this.eatingStapleFood === '70') {
      return '70%';
    } else if (this.eatingStapleFood === '60') {
      return '60%';
    } else if (this.eatingStapleFood === '50') {
      return '1/2';
    } else if (this.eatingStapleFood === '40') {
      return '40%';
    } else if (this.eatingStapleFood === '30') {
      return '30%';
    } else if (this.eatingStapleFood === '20') {
      return '20%';
    } else if (this.eatingStapleFood === '10') {
      return '10%';
    } else if (this.eatingStapleFood === '5') {
      return '二口';
    } else if (this.eatingStapleFood === '2') {
      return '一口';
    } else if (this.eatingStapleFood === '0') {
      return '×';
    }
    return s;
  }

  HyojiString_Fukusyoku() {
    const s = '';
    if (this.eatingAdditionalFood === '100') {
      return '完食';
    } else if (this.eatingAdditionalFood === '90') {
      return '90%';
    } else if (this.eatingAdditionalFood === '80') {
      return '80%';
    } else if (this.eatingAdditionalFood === '70') {
      return '70%';
    } else if (this.eatingAdditionalFood === '60') {
      return '60%';
    } else if (this.eatingAdditionalFood === '50') {
      return '1/2';
    } else if (this.eatingAdditionalFood === '40') {
      return '40%';
    } else if (this.eatingAdditionalFood === '30') {
      return '30%';
    } else if (this.eatingAdditionalFood === '20') {
      return '20%';
    } else if (this.eatingAdditionalFood === '10') {
      return '10%';
    } else if (this.eatingAdditionalFood === '5') {
      return '二口';
    } else if (this.eatingAdditionalFood === '2') {
      return '一口';
    } else if (this.eatingAdditionalFood === '0') {
      return '×';
    }
    return s;
  }

  HyojiString_Sirumono() {
    if (this.eatingSoup === '0') {
      return '×';
    } else {
      if (this.eatingSoup.length === 0) {
        return '';
      } else {
        return this.eatingSoup;
      }
    }
  }

  HyojiString_Otyarui() {
    if (this.eatingTea === '0') {
      return '×';
    } else {
      //return [NSString stringWithFormat:'%@ ml',self.eatingTea];
      if (this.eatingTea.length === 0) {
        return '';
      } else {
        return this.eatingTea;
      }
    }
  }

  HyojiString_Oyatu() {
    const s = '';
    if (this.snackSnack === '100') {
      return '完食';
    } else if (this.snackSnack === '90') {
      return '90%';
    } else if (this.snackSnack === '80') {
      return '80%';
    } else if (this.snackSnack === '60') {
      return '60%';
    } else if (this.snackSnack === '50') {
      return '1/2';
    } else if (this.snackSnack === '40') {
      return '40%';
    } else if (this.snackSnack === '20') {
      return '20%';
    } else if (this.snackSnack === '10') {
      return '10%';
    } else if (this.snackSnack === '0') {
      return '×';
    }
    return s;
  }

  HyojiString_OyatuNomimono() {
    if (this.snackDrink === '0') {
      return '×';
    } else {
      if (this.snackDrink.length === 0) {
        return '';
      } else {
        return this.snackDrink;
      }
    }
  }

  HyojiString_SonotaSuibun() {
    if (this.otherDrinkMoisture === '0') {
      return '×';
    } else {
      return this.otherDrinkMoisture;
    }
  }

  HyojiString_Suibunkei_ml(value: string) {
    if (value === '0') {
      return '×';
    } else {
      if (value.length === 0) {
        return '';
      } else {
        return `${value}ml`;
      }
    }
  }

  getNaiyoWithoutmemo() {
    let s = '';

    if (
      this.eatingClassification === '朝食' ||
      this.eatingClassification === '昼食' ||
      this.eatingClassification === '夕食'
    ) {
      s = `${s}【主食】`;
      s = `${s}${this.HyojiString_Syusyoku()}`;
      s = `${s}【副食】`;
      s = `${s}${this.HyojiString_Fukusyoku()}`;
      s = `${s}【汁物】`;
      s = `${s}${this.HyojiString_Sirumono()}`;
      s = `${s} ml `;
      s = `${s}【お茶等】`;
      s = `${s}${this.HyojiString_Otyarui()}`;
      s = `${s} ml `;
    } else if (
      this.eatingClassification === 'amおやつ' ||
      this.eatingClassification === 'pmおやつ'
    ) {
      s = `${s}【おやつ】`;
      s = `${s}${this.HyojiString_Oyatu()}`;
      s = `${s}【飲み物】`;
      s = `${s}${this.HyojiString_OyatuNomimono()}`;
      s = `${s} ml `;
    } else if (this.eatingClassification === 'その他水分摂取') {
      s = `${s}【区分】`;
      s = `${s}${this.eatingClassification}`;
      s = `${s}\n`;

      s = `${s}【水分】`;
      s = `${s}${this.HyojiString_SonotaSuibun()}`;
      s = `${s} ml `;
      if (this.otherDrinkMoistureContent.length !== 0) {
        s = `${s}【内容】`;
        s = `${s}${this.otherDrinkMoistureContent}`;
      }
    }
    return s;
  }

  GetMealInputData(iStr: string) {
    if (iStr === '完食') {
      return '100';
    } else if (iStr === '90%') {
      return '90';
    } else if (iStr === '80%') {
      return '80';
    } else if (iStr === '70%') {
      return '70';
    } else if (iStr === '60%') {
      return '60';
    } else if (iStr === '1/2') {
      return '50';
    } else if (iStr === '40%') {
      return '40';
    } else if (iStr === '30%') {
      return '30';
    } else if (iStr === '20%') {
      return '20';
    } else if (iStr === '10%') {
      return '10';
    } else if (iStr === '二口') {
      return '5';
    } else if (iStr === '一口') {
      return '2';
    } else if (iStr === '×') {
      return '0';
    } else {
      return '';
    }
  }

  GetDrinksInputData(iStr: string) {
    let s = iStr;
    if (iStr === '×') {
      return '0';
    } else {
      s = s.replace(/iStr/g, 'ml');
    }
    return s;
  }

  ShowMealInputData(iValue: string) {
    const s = '';
    if (iValue === '100') {
      return '完食';
    } else if (iValue === '90') {
      return '90%';
    } else if (iValue === '80') {
      return '80%';
    } else if (iValue === '70') {
      return '70%';
    } else if (iValue === '60') {
      return '60%';
    } else if (iValue === '50') {
      return '1/2';
    } else if (iValue === '40') {
      return '40%';
    } else if (iValue === '30') {
      return '30%';
    } else if (iValue === '20') {
      return '20%';
    } else if (iValue === '10') {
      return '10%';
    } else if (iValue === '5') {
      return '二口';
    } else if (iValue === '2') {
      return '一口';
    } else if (iValue === '0') {
      return '×';
    }
    return s;
  }

  ShowDrinksInputData(iValue: string) {
    if (iValue === '0') {
      return '×';
    } else {
      if (iValue.length === 0) {
        return '';
      } else {
        return iValue;
      }
    }
  }

  NaiyoString() {
    let s = '';

    s = this.getNaiyoWithoutmemo();

    if (this.memo.length !== 0) {
      s = `${s}\n\nメモ:\n-------------------------\n`;
      s = `${s}${this.memo}`;
    }

    return s;
  }

  ColoredNaiyoString(keyWords: string[]) {}

  isOyatsu() {
    if (
      this.eatingClassification === 'amおやつ' ||
      this.eatingClassification === 'pmおやつ'
    ) {
      return true;
    } else {
      return false;
    }
  }

  isSyokuji() {
    if (
      this.eatingClassification === '朝食' ||
      this.eatingClassification === '昼食' ||
      this.eatingClassification === '夕食'
    ) {
      return true;
    } else {
      return false;
    }
  }

  getKubunNum() {
    if (this.eatingClassification === 'amおやつ') {
      return 1;
    } else if (this.eatingClassification === 'pmおやつ') {
      return 2;
    } else if (this.eatingClassification === '朝食') {
      return 3;
    } else if (this.eatingClassification === '昼食') {
      return 4;
    } else if (this.eatingClassification === '夕食') {
      return 5;
    }
    return -1;
  }

  stringBunlui() {
    return '食事/水分摂取記録';
  }

  imageBunlui() {
    return 'ast_shokujisuibun_tama_koushin';
  }

  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    let strRet;

    if (this.eatingClassification === 'その他水分摂取') {
      if (this.otherDrinkTime && this.otherDrinkTime.length > 0) {
        strRet = control.dateTimeJapanStyleFromString(this.otherDrinkTime);
      }
    } else {
      let StrBuff = '';
      if (this.eatingTime && this.eatingTime.length > 0) {
        StrBuff = `${control.dateTimeJapanStyleFromString(this.eatingTime)}\n`;
      }
      StrBuff = `${StrBuff}${this.eatingClassification}`;
      strRet = StrBuff;
    }

    return strRet;
  }

  imagePhoto() {
    return undefined;
  }

  imageActiveity() {
    return undefined;
  }

  stringError() {
    return this.strSendErrMsg;
  }

  async recordDateTime() {
    const control: cUserControls = new cUserControls();
    let stamp;

    if (this.eatingClassification === 'その他水分摂取') {
      stamp = this.otherDrinkTime;
    } else {
      stamp = this.eatingTime;
      if (stamp === '') {
        const dbLogic: DBOperation = new DBOperation();
        const std: cVitalControlData = await dbLogic.getSeigyoTeisuu();

        let tempTime;
        const kubun = this.eatingClassification;
        if (kubun === '朝食') {
          tempTime = std.mealTimeBreakFast;
        } else if (kubun === 'amおやつ') {
          tempTime = std.mealTimeAmSnack;
        } else if (kubun === '昼食') {
          tempTime = std.mealTimeLunch;
        } else if (kubun === 'pmおやつ') {
          tempTime = std.mealTimePmSnack;
        } else if (kubun === '夕食') {
          tempTime = std.mealTimeSupper;
        }
        if (tempTime === '') {
          stamp = this.SyokujiJikan();
        } else {
          stamp = `${this.SyokujiJikan().substr(0, 10)}T${tempTime.substr(
            11,
            8,
          )}`;
        }
      }
    }

    return control.DateFormatterFromString2Date(stamp);
  }

  getMealTypeOfSelf() {
    let type = mealType.MTYPE_NONE;

    const kubun = this.eatingClassification;

    if (kubun === '朝食' || kubun === '昼食' || kubun === '夕食') {
      type = mealType.MTYPE_MEAL;
    } else if (kubun === 'amおやつ' || kubun === 'pmおやつ') {
      type = mealType.MTYPE_SNACK;
    } else if (kubun === 'その他水分摂取') {
      type = mealType.MTYPE_DRINK;
    }
    return type;
  }

  hasAnyValue() {
    let retValue = false;
    let sumLength = 0;
    const type = this.getMealTypeOfSelf();

    switch (type) {
      case mealType.MTYPE_MEAL:
        sumLength += this.eatingStapleFood.length;
        sumLength += this.eatingAdditionalFood.length;
        sumLength += this.eatingSoup.length;
        sumLength += this.eatingTea.length;
        break;
      case mealType.MTYPE_SNACK:
        sumLength += this.snackSnack.length;
        sumLength += this.snackDrink.length;
        break;
      case mealType.MTYPE_DRINK:
        sumLength += this.otherDrinkMoistureContent.length;
        sumLength += this.otherDrinkMoisture.length;
        break;
      case mealType.MTYPE_NONE:
      default:
        break;
    }

    if (sumLength > 0) {
      retValue = true;
    }

    return retValue;
  }

  reportType() {
    return '食事摂取記録';
  }

  reportImageFileName() {
    return 'ast_shokujisuibun_tama';
  }

  reportDate() {
    return this.targetDate;
  }

  reportTime() {
    const parser: cDataClass = new cDataClass();
    if (this.eatingClassification === 'その他水分摂取') {
      return parser.dateStringToTime(this.otherDrinkTime);
    } else {
      return parser.dateStringToTime(this.eatingTime);
    }
  }

  displayReportTime() {
    if (this.eatingClassification === 'その他水分摂取') {
      return this.reportTime();
    } else {
      return this.eatingClassification;
    }
  }

  tenantKey() {
    return this.fkKey;
  }

  memoOfReport() {
    return this.memo;
  }

  subject() {
    return this.NaiyoString();
  }

  reporterName() {
    return this.reporterData.getUserNameString();
  }

  reporterJob() {
    return this.reporterData.userSyokusyuString();
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  serviceName() {
    const control: cUserControls = new cUserControls();
    return control.getServiceName(this.serviceType);
  }

  dateCreateColumn() {
    return '対象年月日';
  }

  tableNameForClass() {
    return 'T_日常業務_食事摂取記録';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
    timeForReported: string | null,
  ) {
    return super.getSqlStringForGettingDataFromServerForFK(
      fk_key,
      from_date,
      to_date,
      reported,
      timeForReported,
    );
  }
}
