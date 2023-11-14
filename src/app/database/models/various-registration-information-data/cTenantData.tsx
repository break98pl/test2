import moment from 'moment';

import {
  DBOperation,
  TBLNAME_BATHINGREPORT,
  TBLNAME_CAREREPORT,
  TBLNAME_EXCRETIONREPORT,
  TBLNAME_MEALREPORT,
  TBLNAME_VITALREPORT,
} from '@modules/operation/operation.service';
import {DBOperation_Residence} from '@modules/resident/resident.service';
import {
  cUserControls,
  OvernightData,
} from '@database/models/functional-model/cUserControls';
import {AppType} from '@modules/setting/setting.type';
import {cDataClass} from '../cDataClass';
import {TodayOutings} from '../TodayOutings';
import {cBathPeriodData} from './cBathPeriodData';
import {cMealManagementData} from './cMealManagementData';
import {cOvernightData} from './cOvernightData';

export class cTenantData {
  imgFlag?: string;
  hideFlag?: string;

  fkKey?: string;
  lastName?: string; // sei16
  firstName?: string; // mei16
  lastNameKana?: string; // sei_kana
  firstNameKana?: string;
  firstNameFurigana?: string;
  lastNameFurigana?: string;
  gender?: string; // seibetsu

  code?: string;
  buildingName?: string; // toumei
  buildingCode?: string; // touCode

  roomName?: string; // heyameisyo
  nursingLevel?: string;

  startDate?: string; // KaisiBi
  endDate?: string; // SyuryoBi

  photoKey?: string;
  photoData?: string;

  dayOfBirth?: string; // seinengappi

  kanaName?: string; // kana_simei

  kanaNameFullWidth?: string;
  SortKeyHeyacodeKana?: string;

  tel?: string;
  telMobile?: string;
  fax?: string;
  addressZipcode?: string;
  addressPrefecture?: string;
  addressCity?: string;
  addressHouseNumber1?: string;
  addressHouseNumber2?: string;
  email?: string;

  contactName_1?: string; // renrakusaki1_simei
  contactRelation_1?: string; // renrakusaki1_Kankei
  contactTel_1?: string; // renrakusaki1_TEL
  contactTelMobile_1?: string; // renrakusaki1_KeitaiTEL
  contactEmail_1?: string; // renrakusaki1_Email
  contactPostalCode_1?: string; // renrakusaki1_YubinNo
  contactPrefecture_1?: string; // renrakusaki1_Ken
  contactDistrict_1?: string; // renrakusaki1_Siku
  contactAddress_1?: string; // renrakusaki1_Jyusyo

  contactName_2?: string; // renrakusaki2_simei
  contactRelation_2?: string; // renrakusaki2_Kankei
  contactTel_2?: string; // renrakusaki2_TEL
  contactTelMobile_2?: string; // renrakusaki2_KeitaiTEL
  contactEmail_2?: string; // renrakusaki2_Email
  contactPostalCode_2?: string; // renrakusaki2_YubinNo
  contactPrefecture_2?: string; // renrakusaki2_Ken
  contactDistrict_2?: string; // renrakusaki2_Siku
  contactAddress_2?: string; // renrakusaki2_Jyusyo

  contactName_3?: string; // renrakusaki3_simei
  contactRelation_3?: string; // renrakusaki3_Kankei
  contactTel_3?: string; // renrakusaki3_TEL
  contactTelMobile_3?: string; // renrakusaki3_KeitaiTEL
  contactEmail_3?: string; // renrakusaki3_Email
  contactPostalCode_3?: string; // renrakusaki3_YubinNo
  contactPrefecture_3?: string; // renrakusaki3_Ken
  contactDistrict_3?: string; // renrakusaki3_Siku
  contactAddress_3?: string; // renrakusaki3_Jyusyo

  mainDoctorHospitalName?: string; // syujii_byoinmei
  mainDoctorDepartmentName?: string; // syujii_kamei
  mainDoctorPostalCode?: string; // syujii_yubinNo
  mainDoctorPrefecture?: string; // syujii_todofuken
  mainDoctorDistrict?: string; // syujii_sikutyoson
  mainDoctorAddress?: string; // syujii_jyuusyo
  mainDoctorTel?: string; // syujii_TEL
  mainDoctorFax?: string; // syujii_FAX
  mainDoctorName?: string; // syujii_simei

  doctorHospitalName?: string; // sikai_byoinmei
  doctorDepartmentName?: string; // sikai_kamei
  doctorPostalCode?: string; // sikai_yubinNo
  doctorPrefecture?: string; // sikai_todofuken
  doctorDistrict?: string; // sikai_sikutyoson
  doctorAddress?: string; // sikai_jyuusyo
  doctorTel?: string; // sikai_TEL
  doctorFax?: string; // sikai_FAX
  doctorName?: string; // sikai_simei

  medicalInfoHospitalName?: string; // iryouJyouhou3_byoinmei
  medicalInfoDepartmentName?: string; // iryouJyouhou3_kamei
  medicalInfoPostalCode?: string; // iryouJyouhou3_yubinNo
  medicalInfoPrefecture?: string; // iryouJyouhou3_todofuken
  medicalInfoDistrict?: string; // iryouJyouhou3_sikutyoson
  medicalInfoAddress?: string; // iryouJyouhou3_jyuusyo
  medicalInfoTel?: string; // iryouJyouhou3_TEL
  medicalInfoFax?: string; // iryouJyouhou3_FAX
  medicalInfoName?: string; // iryouJyouhou3_simei

  pharmacyPharmacyName?: string; // Yakkyoku_Yakkyokumei
  pharmacyPostalCode?: string; // Yakkyoku_yubinNo
  pharmacyPrefecture?: string; // Yakkyoku_todofuken
  pharmacyDistrict?: string; // Yakkyoku_sikutyoson
  pharmacyAddress?: string; // Yakkyoku_jyuusyo
  pharmacyTel?: string; // Yakkyoku_TEL
  pharmacyFax?: string; // Yakkyoku_FAX
  pharmacyName?: string; // Yakkyoku_simei

  certificateValidityBeginPeriod?: string; // NinteiYukoKikanKaishi
  certificateValidityEndPeriod?: string; // NinteiYUkoKIkanSyuryo

  arrayReportData?: any[];
  arrayMealData?: any[];
  arrayVitalData?: any[];
  arrayExcretionData?: any[];
  arrayBathData?: any[];
  arrayServicePlan1Data?: any[];
  arrayPeriodOfStayData?: any[]; // arrayNyusyoKikanData
  arrayOvernightData?: cOvernightData[];
  arrayMealManagementData?: any[]; // arraySyokujiKanriData
  arrayAttentionData?: any[]; // arrayTyuuiJikouData
  indexNumInOneDimenthionArray?: number;
  ArrayCardexData?: any[];
  hasAttention?: boolean;

  selfReliance?: number;

  arrayLetterData?: any[];
  arrayAttendanceData?: any[];
  arrayBaseReportData?: any[];

  IsUpdate?: boolean;

  dateCareReportUpdate?: Date;
  imgPhotoOfcTenant?: any;

  haveCost?: boolean; // IsKeikaAri
  haveMeal?: boolean; // IsSyokujiaAri
  haveVital?: boolean; // IsBitalAri
  haveExcretion?: boolean; // IsHaisetsuAri
  haveBath?: boolean;

  updateKey?: string;
  BinaryTbl_UpdateKey?: string;

  isNotKana?: boolean;

  updateData?: string;

  unitName?: string;
  displayNumber?: string;
  BedNumber?: string;

  todayPlanCurrentStatus?: OvernightData; // NowStatus_GAISYUTUGAIHAKU
  currentStayingRoomPeriodData?: cBathPeriodData; // NowNyusyoKikanData
  todayOutingsForThisTenant?: TodayOutings;

  sortService?: number;
  sortCategory?: number;

  // TODO: need confirm
  countHoumon?: number;
  countKayoi?: number;
  countSyukuhaku?: number;
  countTanki?: number;
  flagZenhaku?: boolean;

  get kanjiName() {
    return `${this.lastName ?? ''} ${this.firstName ?? ''}`;
  }

  constructor() {}

  tenantSeiString() {
    const control: cDataClass = new cDataClass();
    return control.toStringFromHexString(this.lastName);
  }

  tenantMeiString() {
    const control: cDataClass = new cDataClass();
    return control.toStringFromHexString(this.firstName);
  }

  tenantSimeiString() {
    return `${this.tenantSeiString()} ${this.tenantMeiString()}`;
  }

  getKanaString() {
    return `${this.lastNameKana} ${this.firstNameKana}`;
  }

  getAge() {
    return moment(new Date()).diff(moment(this.dayOfBirth), 'years');
  }

  getFloor() {
    if (this.code.length > 2) {
      return this.code.substr(1, 1);
    }

    return '';
  }

  getGaisyutuGaihakuJyotai(date: Date, iIsDayOnly: boolean) {
    let iDate = date;
    const control: cUserControls = new cUserControls();

    if (iIsDayOnly) {
      let DateString = control.DateFormatterFromDate2DBFormat(iDate);
      DateString = `${DateString.substr(0, 10)}T00:00:00`;
      iDate = control.DateFormatterFromString2Date(DateString);
    }

    this.arrayOvernightData.forEach(od => {
      let KaisiString = '';
      let SyuryoString = '';

      if (iIsDayOnly) {
        KaisiString = `${od.startDateString.substr(0, 10)}T00:00:00`;
        SyuryoString = `${od.endDateString.substr(0, 10)}T00:00:00`;
      } else {
        KaisiString = od.startDateString;
        SyuryoString = od.endDateString;
      }
      const DateKaisi = control.DateFormatterFromString2Date(KaisiString);
      const DateSyuryo = control.DateFormatterFromString2Date(SyuryoString);

      const DateOnlyKaisi =
        control.DateFormatterFromString2DateNoTime(KaisiString);
      const DateOnlySyuryo =
        control.DateFormatterFromString2DateNoTime(SyuryoString);

      if (
        (iDate < DateKaisi && iDate > DateSyuryo) ||
        iDate === DateKaisi ||
        iDate === DateSyuryo
      ) {
        if (DateOnlyKaisi === DateOnlySyuryo) {
          if (od.goOutType === '受診') {
            return OvernightData.IsGoOutMeetDoctor;
          } else if (od.goOutType === '面会') {
            return OvernightData.IsGoOutMeeting;
          }
          return OvernightData.IsGoOut;
        } else {
          if (iDate === DateOnlyKaisi) {
            return OvernightData.IsSleepOverOut;
          } else if (iDate === DateOnlySyuryo && iIsDayOnly) {
            return OvernightData.IsSleepOverBack;
          } else if (iDate >= DateSyuryo && !iIsDayOnly) {
            return OvernightData.IsSleepOverBack;
          } else {
            return OvernightData.IsSleepOver;
          }
        }
      }
    });

    return OvernightData.IsNone;
  }

  getGasyutuGaihakuData(date: Date) {
    let iDate = date;
    const control: cUserControls = new cUserControls();
    let DateString = control.DateFormatterFromDate2DBFormat(iDate);
    DateString = `${DateString.substr(0, 10)}T00:00:00`;
    iDate = control.DateFormatterFromString2Date(DateString);

    this.arrayOvernightData.forEach(od => {
      const KaisiString = `${od.startDateString.substr(0, 10)}T00:00:00`;
      const SyuryoString = `${od.endDateString.substr(0, 10)}T00:00:00`;

      const DateKaisi = control.DateFormatterFromString2Date(KaisiString);
      const DateSyuryo = control.DateFormatterFromString2Date(SyuryoString);

      if (
        (iDate > DateKaisi && iDate < DateSyuryo) ||
        iDate === DateKaisi ||
        iDate === DateSyuryo
      ) {
        return od;
      }
    });

    return undefined;
  }

  // async makeStringCurrentDate() {
  //   const tenantViewDate: string = await getTenantViewDate();
  //   return tenantViewDate.substr(0, 10);
  // }

  // async makeStartTimeByTenantViewDate() {
  //   const stringCurrentDate = await this.makeStringCurrentDate();
  //   return `${stringCurrentDate.substr(0, 10)}T00:00:00`;
  // }

  // async makeEndTimeByTenantViewDate() {
  //   const stringCurrentDate = await this.makeStringCurrentDate();
  //   return `${stringCurrentDate.substr(0, 10)}T23:59:59`;
  // }

  async IsNyusyoNow(date: Date) {
    let iDate = date;
    const control: cUserControls = new cUserControls();
    let result = false;

    if (global.appType !== AppType.SHISETSHU) {
      let DateString = control.DateFormatterFromDate2DBFormatNoTime(iDate);
      DateString = `${DateString.substr(0, 10)}T00:00:00`;
      iDate = control.DateFormatterFromString2Date(DateString);
      this.arrayPeriodOfStayData.forEach(nkd => {
        if (nkd.IsBetweenKikan(iDate)) {
          result = true;
        }
      });
    } else {
      iDate = control.trimTimeFromDateTime(iDate);
      const strDate = control.formatterWithDbFormat(iDate);
      const dbo = new DBOperation_Residence();
      result = await dbo.isResidedAsElderlyFkKey(this.fkKey, strDate);
    }
    return result;
  }

  getNowNyusyoData(date: Date) {
    let kd: cBathPeriodData;

    let iDate = date;
    const control: cUserControls = new cUserControls();
    let DateString = control.DateFormatterFromDate2DBFormatNoTime(iDate);
    DateString = `${DateString.substr(0, 10)}T00:00:00`;
    iDate = control.DateFormatterFromString2Date(DateString);
    this.arrayPeriodOfStayData.forEach(nkd => {
      if (nkd.IsBetweenKikan(iDate)) {
        kd = nkd;
      }
    });

    return kd;
  }

  getArraySyokujiKarniDataFromDate(iDate: Date, IsRenraku: boolean) {
    const control: cUserControls = new cUserControls();
    const w_arrayData: cMealManagementData[] = [];
    this.arrayMealManagementData.forEach(skd => {
      let skip = false;
      if (IsRenraku) {
        if (skd.SyokujiKanriID === '1') {
          skip = true;
        }
      } else {
        if (skd.SyokujiKanriID === '2') {
          skip = true;
        }
      }

      if (!skip) {
        const DateKaisi = control.DateFormatterFromString2Date(
          skd.periodStartDate,
        );
        let DateSyuryo;

        //終了期間が指定されていない場合
        if (skd.Kikan_Syuryo_Nengappi.length === 0) {
          DateSyuryo = control.DateFormatterFromString2Date(
            '2500-12-31T23:59:59',
          );
        } else {
          DateSyuryo = control.DateFormatterFromString2Date(
            skd.Kikan_Syuryo_Nengappi,
          );
        }

        //期間内にある
        if (
          (iDate > DateKaisi && iDate < DateSyuryo) ||
          iDate === DateKaisi ||
          iDate === DateSyuryo
        ) {
          w_arrayData.push(skd);
        }
      }
    });

    //対象日の期間内にあるリスト内で、最新の日付を取得
    let w_UpdateDate = control.DateFormatterFromString2Date(
      '1900-01-01T00:00:00',
    );
    w_arrayData.forEach(skd => {
      const DateKaisi = control.DateFormatterFromString2Date(
        skd.periodStartDate,
      );
      if (w_UpdateDate < DateKaisi) {
        w_UpdateDate = DateKaisi;
      }
    });

    //最新の日付と同じ日付のデータをリスト化。同日に複数あればそれも含まれる
    const w_arrayUpateData: cMealManagementData[] = [];
    w_arrayData.forEach(skd => {
      if (
        w_UpdateDate ===
        control.DateFormatterFromString2Date(skd.periodStartDate)
      ) {
        w_arrayUpateData.push(skd);
      }
    });

    return w_arrayUpateData;
  }

  getNowSyokujiKarniData(date: Date, iString: string, IsRenraku: boolean) {
    let iDate = date;
    const control: cUserControls = new cUserControls();
    let DateString = control.DateFormatterFromDate2DBFormat(iDate);

    let time_iString;

    if (iString === '朝食') {
      time_iString = '07:00:00';
    } else if (iString === 'amおやつ') {
      time_iString = '10:00:00';
    } else if (iString === '昼食') {
      time_iString = '12:00:00';
    } else if (iString === 'pmおやつ') {
      time_iString = '15:00:00';
    } else if (iString === '夕食') {
      time_iString = '18:00:00';
    } else {
      time_iString = '00:00:00';
    }

    DateString = `${DateString.substr(0, 10)}T${time_iString}`;
    iDate = control.DateFormatterFromString2Date(DateString);

    let rd: cMealManagementData;
    let stop = false;
    this.arrayMealManagementData.forEach(skd => {
      if (!stop) {
        let skip = false;
        if (IsRenraku) {
          if (skd.SyokujiKanriID === '1') {
            skip = true;
          }
        } else {
          if (skd.SyokujiKanriID === '2') {
            skip = true;
          }
        }

        if (!skip) {
          //開始
          let timeKaishiString = '';

          if (skd.Kikan_Kaishi_Syokuji === '朝') {
            timeKaishiString = '07:00:00';
          } else if (skd.Kikan_Kaishi_Syokuji === '昼') {
            timeKaishiString = '12:00:00';
          } else if (skd.Kikan_Kaishi_Syokuji === '夕') {
            timeKaishiString = '18:00:00';
          }

          const KaisiString = `${skd.periodStartDate.substr(
            0,
            10,
          )}T${timeKaishiString}`;
          const DateKaisi = control.DateFormatterFromString2Date(KaisiString);

          //終了
          let timeSyuryoString = '';

          if (skd.Kikan_Syuryo_Syokuji === '朝') {
            timeSyuryoString = '07:00:00';
          } else if (skd.Kikan_Syuryo_Syokuji === '昼') {
            timeSyuryoString = '12:00:00';
          } else if (skd.Kikan_Syuryo_Syokuji === '夕') {
            timeSyuryoString = '18:00:00';
          }

          let SyuryoString = '';
          let DateSyuryo;
          if (skd.Kikan_Syuryo_Nengappi.length === 0) {
            DateSyuryo = control.DateFormatterFromString2Date(
              '2500-12-31T23:59:59',
            );
          } else {
            SyuryoString = `${skd.Kikan_Syuryo_Nengappi.substr(
              0,
              10,
            )}T${timeSyuryoString}`;
            DateSyuryo = control.DateFormatterFromString2Date(SyuryoString);
          }

          if (iDate >= DateKaisi && iDate <= DateSyuryo) {
            rd = skd;
            stop = true;
          }
        }
      }
    });

    return rd;
  }

  async setKirokuUpdateFlg() {
    //各記録の有無
    this.haveCost = false;
    this.haveMeal = false;
    this.haveVital = false;
    this.haveExcretion = false;
    this.haveBath = false;

    const dbLogic: DBOperation = new DBOperation();

    const check1 = await dbLogic.hasUpdatedRecForFkkey(
      this.fkKey,
      TBLNAME_CAREREPORT,
    );
    this.haveCost = check1;

    const check2 = await dbLogic.hasUpdatedRecForFkkey(
      this.fkKey,
      TBLNAME_MEALREPORT,
    );
    this.haveMeal = check2;

    const check3 = await dbLogic.hasUpdatedRecForFkkey(
      this.fkKey,
      TBLNAME_VITALREPORT,
    );
    this.haveVital = check3;

    const check4 = await dbLogic.hasUpdatedRecForFkkey(
      this.fkKey,
      TBLNAME_EXCRETIONREPORT,
    );
    this.haveExcretion = check4;

    const check5 = await dbLogic.hasUpdatedRecForFkkey(
      this.fkKey,
      TBLNAME_BATHINGREPORT,
    );
    this.haveBath = check5;
  }

  getTenantData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    const control: cDataClass = new cDataClass();

    this.fkKey = parser.getDataValueFromKeyAndTargetArray('PK_利用者', ad);
    this.lastName = control.toStringFromHexString(
      parser.getDataValueFromKeyAndTargetArray('姓_16進文字列', ad),
    );
    this.firstName = control.toStringFromHexString(
      parser.getDataValueFromKeyAndTargetArray('名_16進文字列', ad),
    );
    this.lastNameKana = parser.getDataValueFromKeyAndTargetArray(
      '姓__xFF8C__xFF98__xFF76__xFF9E__xFF85_',
      ad,
    );
    this.firstNameKana = parser.getDataValueFromKeyAndTargetArray(
      '名__xFF8C__xFF98__xFF76__xFF9E__xFF85_',
      ad,
    );
    this.gender = parser.getDataValueFromKeyAndTargetArray('性別', ad);
    this.code = parser.getDataValueFromKeyAndTargetArray('コード', ad);
    this.buildingName = parser.getDataValueFromKeyAndTargetArray('棟名', ad);
    this.roomName = parser.getDataValueFromKeyAndTargetArray('部屋名称', ad);
    this.nursingLevel = parser.getDataValueFromKeyAndTargetArray(
      '要介護状態区分等',
      ad,
    );
    this.startDate = parser.getDataValueFromKeyAndTargetArray('開始日', ad);
    this.endDate = parser.getDataValueFromKeyAndTargetArray('終了日', ad);
    this.photoKey = parser.getDataValueFromKeyAndTargetArray('キー', ad);
    this.photoData = parser.getDataValueFromKeyAndTargetArray('データ', ad);
    this.dayOfBirth = parser.getDataValueFromKeyAndTargetArray('生年月日', ad);
    this.kanaName = `${this.lastNameKana}${this.firstNameKana}`;
    this.SortKeyHeyacodeKana = `${this.code} ${this.kanaName}`;
    this.contactName_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_氏名',
      ad,
    );
    this.contactRelation_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_関係',
      ad,
    );

    this.contactTel_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_TEL',
      ad,
    );
    this.contactTelMobile_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_携帯',
      ad,
    );
    this.contactEmail_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_EMail',
      ad,
    );
    this.contactPostalCode_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_郵便番号',
      ad,
    );
    this.contactPrefecture_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_都道府県',
      ad,
    );
    this.contactDistrict_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_市区町村',
      ad,
    );
    this.contactAddress_1 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先1_住所',
      ad,
    );

    this.contactName_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_氏名',
      ad,
    );
    this.contactRelation_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_関係',
      ad,
    );
    this.contactTel_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_TEL',
      ad,
    );
    this.contactTelMobile_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_携帯',
      ad,
    );
    this.contactEmail_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_EMail',
      ad,
    );
    this.contactPostalCode_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_郵便番号',
      ad,
    );
    this.contactPrefecture_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_都道府県',
      ad,
    );
    this.contactDistrict_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_市区町村',
      ad,
    );
    this.contactAddress_2 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先2_住所',
      ad,
    );

    this.contactName_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_氏名',
      ad,
    );
    this.contactRelation_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_関係',
      ad,
    );
    this.contactTel_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_TEL',
      ad,
    );
    this.contactTelMobile_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_携帯',
      ad,
    );
    this.contactEmail_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_EMail',
      ad,
    );
    this.contactPostalCode_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_郵便番号',
      ad,
    );
    this.contactPrefecture_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_都道府県',
      ad,
    );
    this.contactDistrict_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_市区町村',
      ad,
    );
    this.contactAddress_3 = parser.getDataValueFromKeyAndTargetArray(
      '連絡先3_住所',
      ad,
    );

    this.mainDoctorHospitalName = parser.getDataValueFromKeyAndTargetArray(
      '主治医_病院名',
      ad,
    );
    this.mainDoctorDepartmentName = parser.getDataValueFromKeyAndTargetArray(
      '主治医_科名',
      ad,
    );
    this.mainDoctorPostalCode = parser.getDataValueFromKeyAndTargetArray(
      '主治医_郵便番号',
      ad,
    );
    this.mainDoctorPrefecture = parser.getDataValueFromKeyAndTargetArray(
      '主治医_都道府県',
      ad,
    );
    this.mainDoctorDistrict = parser.getDataValueFromKeyAndTargetArray(
      '主治医_市区町村',
      ad,
    );
    this.mainDoctorAddress = parser.getDataValueFromKeyAndTargetArray(
      '主治医_住所',
      ad,
    );
    this.mainDoctorTel = parser.getDataValueFromKeyAndTargetArray(
      '主治医_TEL',
      ad,
    );
    this.mainDoctorFax = parser.getDataValueFromKeyAndTargetArray(
      '主治医_FAX',
      ad,
    );
    this.mainDoctorName = parser.getDataValueFromKeyAndTargetArray(
      '主治医_氏名',
      ad,
    );

    this.doctorHospitalName = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_病院名',
      ad,
    );
    this.doctorDepartmentName = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_科名',
      ad,
    );
    this.doctorPostalCode = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_郵便番号',
      ad,
    );
    this.doctorPrefecture = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_都道府県',
      ad,
    );
    this.doctorDistrict = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_市区町村',
      ad,
    );
    this.doctorAddress = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_住所',
      ad,
    );
    this.doctorTel = parser.getDataValueFromKeyAndTargetArray('歯科医_TEL', ad);
    this.doctorFax = parser.getDataValueFromKeyAndTargetArray('歯科医_FAX', ad);
    this.doctorName = parser.getDataValueFromKeyAndTargetArray(
      '歯科医_氏名',
      ad,
    );

    this.medicalInfoHospitalName = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_病院名',
      ad,
    );
    this.medicalInfoDepartmentName = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_科名',
      ad,
    );
    this.medicalInfoPostalCode = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_郵便番号',
      ad,
    );
    this.medicalInfoPrefecture = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_都道府県',
      ad,
    );
    this.medicalInfoDistrict = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_市区町村',
      ad,
    );
    this.medicalInfoAddress = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_住所',
      ad,
    );
    this.medicalInfoTel = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_TEL',
      ad,
    );
    this.medicalInfoFax = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_FAX',
      ad,
    );
    this.medicalInfoName = parser.getDataValueFromKeyAndTargetArray(
      '医療情報3_氏名',
      ad,
    );

    this.pharmacyPharmacyName = parser.getDataValueFromKeyAndTargetArray(
      '薬局_薬局名',
      ad,
    );
    this.pharmacyPostalCode = parser.getDataValueFromKeyAndTargetArray(
      '薬局_郵便番号',
      ad,
    );
    this.pharmacyPrefecture = parser.getDataValueFromKeyAndTargetArray(
      '薬局_都道府県',
      ad,
    );
    this.pharmacyDistrict = parser.getDataValueFromKeyAndTargetArray(
      '薬局_市区町村',
      ad,
    );
    this.pharmacyAddress = parser.getDataValueFromKeyAndTargetArray(
      '薬局_住所',
      ad,
    );
    this.pharmacyTel = parser.getDataValueFromKeyAndTargetArray('薬局_TEL', ad);
    this.pharmacyFax = parser.getDataValueFromKeyAndTargetArray('薬局_FAX', ad);
    this.pharmacyName = parser.getDataValueFromKeyAndTargetArray(
      '薬局_担当者名',
      ad,
    );

    this.certificateValidityBeginPeriod =
      parser.getDataValueFromKeyAndTargetArray('認定の有効期間_開始', ad);
    this.certificateValidityEndPeriod =
      parser.getDataValueFromKeyAndTargetArray('認定の有効期間_終了', ad);

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.BinaryTbl_UpdateKey = parser.getDataValueFromKeyAndTargetArray(
      'T_バイナリ更新キー',
      ad,
    );
  }

  async getNowNyusyoDataForDate(target_date: string) {
    const control: cUserControls = new cUserControls();
    let retData: cBathPeriodData;
    if (global.appType !== AppType.SHISETSHU) {
      const date = control.DateFormatterFromString2Date(target_date);
      this.arrayPeriodOfStayData.forEach(nkd => {
        if (nkd.isBetweenKikan(date)) {
          retData = nkd;
          this.startDate = nkd.KaisiDate;
          this.endDate = nkd.SyuryoDate;

          this.code = nkd.code;
          this.roomName = nkd.roomName;
          this.unitName = nkd.UnitMei;
          this.displayNumber = nkd.hyojiNum;
          this.BedNumber = nkd.bedNum;
          this.buildingName = nkd.buildingName;
          this.buildingCode = nkd.buildingCode;
        }
      });
    } else {
      const dbLogic: DBOperation_Residence = new DBOperation_Residence();
      retData = await dbLogic.getNyusyokikanDataForFkKey(
        this.fkKey,
        target_date,
      );
    }
    return retData;
  }

  SortNumberByHyojiNum() {
    if (!this.displayNumber) {
      return 0;
    } else {
      return parseInt(this.displayNumber, 10);
    }
  }

  SortNumberByBedNumber() {
    if (!this.BedNumber) {
      return 0;
    } else {
      return parseInt(this.BedNumber, 10);
    }
  }

  SortNumberByFloor() {
    const strFloor = this.getFloor();
    if (strFloor.length === 0) {
      return 0;
    } else {
      return parseInt(strFloor, 10);
    }
  }

  convertHalfWidthToFullWidth(str: string): string {
    let result = '';

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);

      // Handling ASCII range
      if (charCode >= 0x21 && charCode <= 0x7e) {
        result += String.fromCharCode(charCode + 0xfee0);
      }
      // Handling half-width Katakana
      else if (charCode >= 0xff61 && charCode <= 0xff9f) {
        const kanaMap: {[key: number]: number} = {
          0xff61: 0x3002, // 。 (Ideographic Full Stop)
          0xff62: 0x300c, // 「 (Left Corner Bracket)
          0xff63: 0x300d, // 」 (Right Corner Bracket)
          0xff64: 0x3001, // 、 (Ideographic Comma)
          0xff65: 0x30fb, // ・ (Katakana Middle Dot)
          0xff66: 0x30f2, // ヲ
          0xff67: 0x30a1, // ァ
          0xff68: 0x30a3, // ィ
          0xff69: 0x30a5, // ゥ
          0xff6a: 0x30a7, // ェ
          0xff6b: 0x30a9, // ォ
          0xff6c: 0x30e3, // ャ
          0xff6d: 0x30e5, // ュ
          0xff6e: 0x30e7, // ョ
          0xff6f: 0x30c3, // ッ
          0xff70: 0x30fc, // ー
          0xff71: 0x30a2, // ア
          0xff72: 0x30a4, // イ
          0xff73: 0x30a6, // ウ
          0xff74: 0x30a8, // エ
          0xff75: 0x30aa, // オ
          0xff76: 0x30ab, // カ
          0xff77: 0x30ad, // キ
          0xff78: 0x30af, // ク
          0xff79: 0x30b1, // ケ
          0xff7a: 0x30b3, // コ
          0xff7b: 0x30b5, // サ
          0xff7c: 0x30b7, // シ
          0xff7d: 0x30b9, // ス
          0xff7e: 0x30bb, // セ
          0xff7f: 0x30bd, // ソ
          0xff80: 0x30bf, // タ
          0xff81: 0x30c1, // チ
          0xff82: 0x30c4, // ツ
          0xff83: 0x30c6, // テ
          0xff84: 0x30c8, // ト
          0xff85: 0x30ca, // ナ
          0xff86: 0x30cb, // ニ
          0xff87: 0x30cc, // ヌ
          0xff88: 0x30cd, // ネ
          0xff89: 0x30ce, // ノ
          0xff8a: 0x30cf, // ハ
          0xff8b: 0x30d2, // ヒ
          0xff8c: 0x30d5, // フ
          0xff8d: 0x30d8, // ヘ
          0xff8e: 0x30db, // ホ
          0xff8f: 0x30de, // マ
          0xff90: 0x30df, // ミ
          0xff91: 0x30e0, // ム
          0xff92: 0x30e1, // メ
          0xff93: 0x30e2, // モ
          0xff94: 0x30e4, // ヤ
          0xff95: 0x30e6, // ユ
          0xff96: 0x30e8, // ヨ
          0xff97: 0x30e9, // ラ
          0xff98: 0x30ea, // リ
          0xff99: 0x30eb, // ル
          0xff9a: 0x30ec, // レ
          0xff9b: 0x30ed, // ロ
          0xff9c: 0x30ef, // ワ
          0xff9d: 0x30f3, // ン
          0xff9e: 0x3099, // ゙ (Voiced Sound Mark)
          0xff9f: 0x309a, // ゚ (Semi-Voiced Sound Mark)
        };
        result += String.fromCharCode(kanaMap[charCode] || charCode);
      } else {
        result += str[i];
      }
    }

    return result;
  }

  IsNoUnit() {
    return this.unitName === '' ? 1 : 0;
  }

  IsNoRoom() {
    return this.roomName === '' ? 1 : 0;
  }

  //   SortNumberByServiceNum{
  //     return this.SortService();
  // }

  NaiyoString() {
    if (global.appType === AppType.JUTAKU) {
      return '入居者 写真変更';
    } else if (global.appType === AppType.TAKINO) {
      return '登録者 写真変更';
    } else {
      return '来所者 写真変';
    }
  }

  strSendErrMsg() {
    return undefined;
  }

  stringBunlui() {
    if (global.appType === AppType.JUTAKU) {
      return '入居者情報';
    } else if (global.appType === AppType.TAKINO) {
      return '登録者情報';
    } else {
      return '来所者情報';
    }
  }

  imageBunlui() {
    return 'ast_keikakiroku_tama_koushin';
  }

  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    return control.dateTimeJapanStyleFromString(
      this.updateData.replace(' ', 'T'),
    );
  }
  imagePhoto() {
    let img;
    if (this.photoKey.length > 0) {
      img = `${this.photoKey}.jpeg`;
    }
    return img;
  }
  imageActiveity() {
    return undefined;
  }

  tableName() {
    return 'M_利用者_個人';
  }
  stringError() {
    return undefined;
  }

  reporterName() {
    return undefined;
  }

  reporterCode() {
    return undefined;
  }

  getNameWithTittle(name: string) {
    let strRet;
    if (name === undefined || name === '' || name.length === 0) {
      strRet = '';
    } else {
      strRet = `${name} 様`;
    }

    return strRet;
  }

  getHeyameisyo() {
    if (!this.roomName) {
      return '';
    } else {
      return this.roomName;
    }
  }
  getUnitmei() {
    if (!this.unitName) {
      return '';
    } else {
      return this.unitName;
    }
  }
  getToumei() {
    if (!this.buildingName) {
      return '';
    } else {
      return this.buildingName;
    }
  }

  getTenantPhotoData() {
    let photoImage;
    if (this.photoKey.length > 0) {
      photoImage = `${this.photoKey}.jpeg`;
    } else {
      if (this.gender === '男性') {
        photoImage = 'person_male.gif';
      } else {
        photoImage = 'person_female.gif';
      }
    }
    return photoImage;
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string,
    from_date: Date,
    to_date: Date,
    reported: boolean,
  ) {
    const control: cUserControls = new cUserControls();

    let sqlString;
    const nowDate = new Date();
    let toDate = to_date ? to_date : new Date();

    toDate = moment(toDate).add(1, 'day').toDate();

    const fromDate = from_date
      ? from_date
      : control.GetIntervalBeginDateFromDate(toDate);

    const strNowDate = moment(nowDate).format('YYYY-MM-DD');
    const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    const strToDate = moment(toDate).format('YYYY-MM-DD');

    sqlString =
      'SELECT * FROM T_利用者情報_注意事項 WHERE レコード削除情報 IS NULL ';

    if (reported) {
      sqlString = `${sqlString}AND ((対象年月日 < '${strToDate}' AND 対象年月日 >= '${strFromDate}' ) OR (掲載期限日 >= '${strNowDate}' AND 期間_選択項目 IS NOT NULL )) `;
    } else {
      sqlString = `${sqlString}AND (対象年月日 < '${strToDate}' AND 対象年月日 >= '${strFromDate}' ) AND (掲載期限日 IS NULL OR 掲載期限日<'${strNowDate}') `;
    }

    const dbLogic: DBOperation = new DBOperation();
    const dbLogicR: DBOperation_Residence = new DBOperation_Residence();

    const arrFkKeys: string[] = fk_key
      ? [fk_key]
      : global.appType === AppType.JUTAKU
      ? await dbLogicR.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([])
      : await dbLogic.getUserID();

    if (arrFkKeys.length > 0) {
      const strWhere = `AND FK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }

  parseFromRawData(record: Record<string, string | null>) {
    const control: cDataClass = new cDataClass();

    this.fkKey = record['PK_利用者'] ?? '';
    this.lastName = record['姓_16進文字列']
      ? control.toStringFromHexString(record['姓_16進文字列'])
      : '';
    this.firstName = record['名_16進文字列']
      ? control.toStringFromHexString(record['名_16進文字列'])
      : '';
    // this.lastNameKana = record['姓'] ?? '';
    // this.firstNameKana = record[''] ?? '';
    this.firstNameFurigana = record['名_ﾌﾘｶﾞﾅ'] ?? '';
    this.lastNameFurigana = record['姓_ﾌﾘｶﾞﾅ'] ?? '';
    this.gender = record['性別'] ?? '';
    this.code = record['コード'] ?? '';
    this.buildingName = record['棟名'] ?? '';
    this.roomName = record['部屋名称'] ?? '';
    this.nursingLevel = record['要介護状態区分等'] ?? '';
    this.startDate = record['開始日'] ?? '';
    this.endDate = record['終了日'] ?? '';
    this.photoKey = record['写真データKey'] ?? '';
    this.photoData = record['データ'] ?? '';
    this.dayOfBirth = record['生年月日'] ?? '';
    this.kanaName = `${this.lastNameFurigana} ${this.firstNameFurigana}` ?? '';
    this.kanaNameFullWidth = this.convertHalfWidthToFullWidth(this.kanaName);
    const firstChar: number = this.kanaNameFullWidth.charCodeAt(0);
    if (
      (firstChar >= 0x30a0 && firstChar <= 0x30ff) ||
      (firstChar >= 0x31f0 && firstChar <= 0x31ff)
    ) {
      this.isNotKana = false;
    } else {
      this.isNotKana = true;
    }

    this.SortKeyHeyacodeKana = `${this.code} ${this.kanaName}` ?? '';
    this.contactName_1 = record['連絡先1_氏名'] ?? '';
    this.contactRelation_1 = record['連絡先1_関係'] ?? '';

    this.contactTel_1 = record['連絡先1_TEL'] ?? '';
    this.contactTelMobile_1 = record['連絡先1_携帯'] ?? '';
    this.contactEmail_1 = record['連絡先1_EMail'] ?? '';
    this.contactPostalCode_1 = record['連絡先1_郵便番号'] ?? '';
    this.contactPrefecture_1 = record['連絡先1_都道府県'] ?? '';
    this.contactDistrict_1 = record['連絡先1_市区町村'] ?? '';
    this.contactAddress_1 = record['連絡先1_住所'] ?? '';

    this.contactName_2 = record['連絡先2_氏名'] ?? '';
    this.contactRelation_2 = record['連絡先2_関係'] ?? '';
    this.contactTel_2 = record['連絡先2_TEL'] ?? '';
    this.contactTelMobile_2 = record['連絡先2_携帯'] ?? '';
    this.contactEmail_2 = record['連絡先2_EMail'] ?? '';
    this.contactPostalCode_2 = record['連絡先2_郵便番号'] ?? '';
    this.contactPrefecture_2 = record['連絡先2_都道府県'] ?? '';
    this.contactDistrict_2 = record['連絡先2_市区町村'] ?? '';
    this.contactAddress_2 = record['連絡先2_住所'] ?? '';

    this.contactName_3 = record['連絡先3_氏名'] ?? '';
    this.contactRelation_3 = record['連絡先3_関係'] ?? '';
    this.contactTel_3 = record['連絡先3_TEL'] ?? '';
    this.contactTelMobile_3 = record['連絡先3_携帯'] ?? '';
    this.contactEmail_3 = record['連絡先3_EMail'] ?? '';
    this.contactPostalCode_3 = record['連絡先3_郵便番号'] ?? '';
    this.contactPrefecture_3 = record['連絡先3_都道府県'] ?? '';
    this.contactDistrict_3 = record['連絡先3_市区町村'] ?? '';
    this.contactAddress_3 = record['連絡先3_住所'] ?? '';

    this.mainDoctorHospitalName = record['主治医_病院名'] ?? '';
    this.mainDoctorDepartmentName = record['主治医_科名'] ?? '';
    this.mainDoctorPostalCode = record['主治医_郵便番号'] ?? '';
    this.mainDoctorPrefecture = record['主治医_都道府県'] ?? '';
    this.mainDoctorDistrict = record['主治医_市区町村'] ?? '';
    this.mainDoctorAddress = record['主治医_住所'] ?? '';
    this.mainDoctorTel = record['主治医_TEL'] ?? '';
    this.mainDoctorFax = record['主治医_FAX'] ?? '';
    this.mainDoctorName = record['主治医_氏名'] ?? '';

    this.doctorHospitalName = record['歯科医_病院名'] ?? '';
    this.doctorDepartmentName = record['歯科医_科名'] ?? '';
    this.doctorPostalCode = record['歯科医_郵便番号'] ?? '';
    this.doctorPrefecture = record['歯科医_都道府県'] ?? '';
    this.doctorDistrict = record['歯科医_市区町村'] ?? '';
    this.doctorAddress = record['歯科医_住所'] ?? '';
    this.doctorTel = record['歯科医_TEL'] ?? '';
    this.doctorFax = record['歯科医_FAX'] ?? '';
    this.doctorName = record['歯科医_氏名'] ?? '';

    this.medicalInfoHospitalName = record['医療情報3_病院名'] ?? '';
    this.medicalInfoDepartmentName = record['医療情報3_科名'] ?? '';
    this.medicalInfoPostalCode = record['医療情報3_郵便番号'] ?? '';
    this.medicalInfoPrefecture = record['医療情報3_都道府県'] ?? '';
    this.medicalInfoDistrict = record['医療情報3_市区町村'] ?? '';
    this.medicalInfoAddress = record['医療情報3_住所'] ?? '';
    this.medicalInfoTel = record['医療情報3_TEL'] ?? '';
    this.medicalInfoFax = record['医療情報3_FAX'] ?? '';
    this.medicalInfoName = record['医療情報3_氏名'] ?? '';

    this.pharmacyPharmacyName = record['薬局_薬局名'] ?? '';
    this.pharmacyPostalCode = record['薬局_郵便番号'] ?? '';
    this.pharmacyPrefecture = record['薬局_都道府県'] ?? '';
    this.pharmacyDistrict = record['薬局_市区町村'] ?? '';
    this.pharmacyAddress = record['薬局_住所'] ?? '';
    this.pharmacyTel = record['薬局_TEL'] ?? '';
    this.pharmacyFax = record['薬局_FAX'] ?? '';
    this.pharmacyName = record['薬局_担当者名'] ?? '';

    this.certificateValidityBeginPeriod = record['認定の有効期間_開始'] ?? '';
    this.certificateValidityEndPeriod = record['認定の有効期間_終了'] ?? '';

    this.updateKey = record['更新キー'] ?? '';
    this.BinaryTbl_UpdateKey = record['T_バイナリ更新キー'] ?? '';
  }
}
