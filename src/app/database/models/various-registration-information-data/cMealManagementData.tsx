import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';

/**
 * class old name: cSyokujiKanriData
 */
export class cMealManagementData {
  sortStartDate?: string; //sortKaisiBi
  mealManagementId?: string; //SyokujiKanriID
  fkKey?: string;
  userName?: string; //RiyosyaMei
  nonDisplayFlag?: string; //HihyojiFlag
  periodStartDate?: string; //Kikan_Kaishi_Nengappi
  periodStartMeal?: string; //Kikan_Kaishi_Syokuji
  periodEndDate?: string; //Kikan_Syuryo_Nengappi
  periodEndMeal?: string; //Kikan_Syuryo_Syokuji
  confirmDoctorCode?: string; //Kakunin_Ishi_TantosyaCode
  confirmDoctorDate?: string; //Kakunin_Ishi_Nengappi
  confirmCarerCode?: string; //Kakunin_Kaigoin_TantosyaCode
  confirmCarerDate?: string; //Kakunin_Kaigoin_Nengappi
  nourishmentSpecialistCode?: string; //Kakunin_KanriEiyoshi_TantosyaCode
  nourishmentSpecialistDate?: string; //Kakunin_KanriEiyoshi_Nengappi
  confirmNurseCode?: string; //Kakunin_Kangoshi_TantosyaCode
  confirmNurseDate?: string; //Kakunin_Kangoshi_Nengappi
  confirmServiceProviderCode?: string; //Kakunin_Teikyosya_TantosyaCode
  confirmServiceProviderDate?: string; //Kakunin_Teikyosya_Nengappi
  confirmAdvisorCode?: string; //Kakunin_Soudanin_TantosyaCode
  confirmAdvisorDate?: string; //Kakunin_Soudanin_Nengappi
  useService?: string; //RiyouService
  category?: string; //Kubun
  categoryReason?: string; //Kubun_Riyu
  categoryChangeReason?: string; //Kubun_Henkoriyu
  diseaseName?: string; //Byoumei
  notes?: string; //Bikou
  attentionItem?: string; //TyuuiJikou
  foodCategory?: string; //SyokusyuKubun
  /**
   * Meal types category_Concentrated liquid diet for feeding tube_notes
   */
  mealTypesLiquidDietNotes?: string; //SyokusyuKubun_KeikanyoNoukouRyoudouSyoku_Bikou
  /**
   * Meal types category_Diabetic Food_notes
   */
  mealTypesDiabeticFoodNotes?: string; //SyokusyuKUbun_TounyouByoSyoku_Bikou
  /**
   * Meal types category_others_notes
   */
  mealTypesOtherNotes?: string;
  /**
   * Meal Category_Others_For medical treatment meals
   */
  medicalTreatmentMeals?: string;
  usedTool?: string; // SiyouDougu
  mainFoodCategory?: string; //SyusyokuKubun
  /**
   * main meal category_Main food quantity
   */
  mainFoodQuantity?: string; //SyusyokuKubun_Syusyokuryo
  /**
   * Main food category_other_notes
   */
  mainFoodOtherNotes?: string; //SyusyokuKubun_Ta_Bikou
  /**
   * Main food category_When eating bread
   */
  mainFoodWhenEatingBread?: string; //SyusyokuKubun_Pansyokuji
  /**
   * Main food classification_Bread meal_Others_Notes
   */
  mainFoodBreadMealOtherNotes?: string; //SyusyokuKubun_Pansyokuji_Ta_Bikou
  sideDish?: string; //Fukusyouku_Keitai
  /**
   * Side dish form_other_Notes
   */
  sideDishOtherNotes?: string; //Fukusyouku_Keitai_Ta_Bikou
  /**
   * Money charged target_types
   */
  moneyChargedTargetType?: string; //SeikyuKasanTaisyo_Syurui

  /**
   * only available for shisetsu
   */
  updateFlag?: string; // henkoFuragu

  /**
   * only available for shisetsu
   */
  newFlag?: string; // shinkiFuragu

  constructor() {}

  getData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();
    this.mealManagementId = parser.getDataValueFromKeyAndTargetArray(
      '食事管理ID',
      ad,
    );
    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.userName = parser.getDataValueFromKeyAndTargetArray('利用者名', ad);
    this.nonDisplayFlag = parser.getDataValueFromKeyAndTargetArray(
      '非表示フラグ',
      ad,
    );

    this.periodStartDate = parser.getDataValueFromKeyAndTargetArray(
      '期間_開始_年月日',
      ad,
    );
    this.periodStartMeal = parser.getDataValueFromKeyAndTargetArray(
      '期間_開始_食事',
      ad,
    );
    this.periodEndDate = parser.getDataValueFromKeyAndTargetArray(
      '期間_終了_年月日',
      ad,
    );
    this.periodEndMeal = parser.getDataValueFromKeyAndTargetArray(
      '期間_終了_食事',
      ad,
    );

    this.confirmDoctorCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_医師_担当者コード',
      ad,
    );
    this.confirmDoctorDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_医師_年月日',
      ad,
    );
    this.confirmCarerCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_介護員_担当者コード',
      ad,
    );
    this.confirmCarerDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_介護員_年月日',
      ad,
    );
    this.nourishmentSpecialistCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_管理栄養士_担当者コード',
      ad,
    );
    this.nourishmentSpecialistDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_管理栄養士_年月日',
      ad,
    );
    this.confirmNurseCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_看護師_担当者コード',
      ad,
    );
    this.confirmNurseDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_看護師_年月日',
      ad,
    );
    this.confirmServiceProviderCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_提供者_担当者コード',
      ad,
    );
    this.confirmServiceProviderDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_提供者_年月日',
      ad,
    );
    this.confirmAdvisorCode = parser.getDataValueFromKeyAndTargetArray(
      '確認_相談員_担当者コード',
      ad,
    );
    this.confirmAdvisorDate = parser.getDataValueFromKeyAndTargetArray(
      '確認_相談員_年月日',
      ad,
    );

    this.useService = parser.getDataValueFromKeyAndTargetArray(
      '利用サービス',
      ad,
    );
    this.category = parser.getDataValueFromKeyAndTargetArray('区分', ad);
    this.categoryReason = parser.getDataValueFromKeyAndTargetArray(
      '区分_理由',
      ad,
    );
    this.categoryChangeReason = parser.getDataValueFromKeyAndTargetArray(
      '区分_変更_理由',
      ad,
    );
    this.diseaseName = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('病名', ad),
    );
    this.notes = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('備考', ad),
    );
    this.attentionItem = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('注意事項', ad),
    );

    this.foodCategory = parser.getDataValueFromKeyAndTargetArray(
      '食種区分',
      ad,
    );
    this.mealTypesLiquidDietNotes = parser.getDataValueFromKeyAndTargetArray(
      '食種区分_経管用濃厚流動食_備考',
      ad,
    );
    this.mealTypesDiabeticFoodNotes = parser.getDataValueFromKeyAndTargetArray(
      '食種区分_糖尿病食_備考',
      ad,
    );
    this.mealTypesOtherNotes = parser.getDataValueFromKeyAndTargetArray(
      '食種区分_その他_備考',
      ad,
    );
    this.medicalTreatmentMeals = parser.getDataValueFromKeyAndTargetArray(
      '食種区分_その他_療養食加算対象',
      ad,
    );
    this.usedTool = parser.getDataValueFromKeyAndTargetArray('使用道具', ad);

    this.mainFoodCategory = parser.getDataValueFromKeyAndTargetArray(
      '主食区分',
      ad,
    );
    this.mainFoodQuantity = parser.getDataValueFromKeyAndTargetArray(
      '主食区分_主食量',
      ad,
    );
    this.mainFoodOtherNotes = parser.getDataValueFromKeyAndTargetArray(
      '主食区分_他_備考',
      ad,
    );
    this.mainFoodWhenEatingBread = parser.getDataValueFromKeyAndTargetArray(
      '主食区分_パン食時',
      ad,
    );
    this.mainFoodBreadMealOtherNotes = parser.getDataValueFromKeyAndTargetArray(
      '主食区分_パン食時_他_備考',
      ad,
    );
    this.sideDish = parser.getDataValueFromKeyAndTargetArray('副食形態', ad);
    this.sideDishOtherNotes = parser.getDataValueFromKeyAndTargetArray(
      '副食形態_他_備考',
      ad,
    );
    this.moneyChargedTargetType = parser.getDataValueFromKeyAndTargetArray(
      '請求加算対象_種類',
      ad,
    );
  }

  doSetSortKey() {
    let strKaishiSyokuji;

    if (this.periodStartMeal === '朝' || this.periodStartMeal === 'amおやつ') {
      strKaishiSyokuji = '07:00:00';
    } else if (
      this.periodStartMeal === '昼' ||
      this.periodStartMeal === 'pmおやつ'
    ) {
      strKaishiSyokuji = '12:00:00';
    } else if (this.periodStartMeal === '夕') {
      strKaishiSyokuji = '18:00:00';
    } else {
      strKaishiSyokuji = '00:00:00';
    }

    this.sortStartDate = `${this.periodStartDate} ${strKaishiSyokuji}`;
  }
}
