import moment from 'moment';
import {
  CareListTenantInfo,
  MealPlanManagementId,
  RecordType,
} from '@modules/record/record.type';
import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import {convertGenderOfTenant} from '@modules/tenant/tenant.utils';
import {TenantListItem, TodayPlanType} from '@modules/tenant/tenant.type';
import {SettingService} from '@modules/setting/setting.service';
import {DATE_FORMAT, JP_HEISEI_DATE_FORMAT} from '@constants/constants';
import {Colors} from '@themes/colors';
import i18n from 'i18next';
import {ColorValue} from 'react-native';
import {TextListItem} from '@organisms/SelectionList';
import {
  FilterRowType,
  FilterSection,
  FilterTabType,
  TransitTabType,
} from '@organisms/CareListMainFilterTab';
import {Occupations} from './type';

/**
 * @appType SHISETSU - JUTAKI - TAKINO
 * @param tenantData
 */
export const convertToCareTenantInfoUIItemShiJuTa = (
  tenantData: TenantListItem,
): CareListTenantInfo => {
  const dateOfBirth = tenantData.dayOfBirth;

  return {
    tenantCode: tenantData.tenantCode,
    kanjiName: `${tenantData.surnameKanji} ${tenantData.firstNameKanji}`,
    furiganaName: `${tenantData.surnameFurigana} ${tenantData.firstNameFurigana}`,
    photoPath: tenantData.photoPath,
    dateOfBirth,
    age: moment(new Date()).diff(moment(dateOfBirth), 'years'),
    isWarning: tenantData.hasNotice,
    nursingLevel: tenantData.nursingLevel ?? '',
    building: tenantData.room?.buildingName ?? '',
    floor: tenantData.room?.floorName ?? '',
    room: tenantData.room?.name ?? '',
    unit: tenantData.room?.unit ?? '',
    gender: convertGenderOfTenant(tenantData.gender),
    validityPeriod: '',
    fromDateOfCareList: tenantData.careFromDate,
  };
};

/**
 * @appType TSUSHO
 * @param tenantData
 */
export const convertToCareTenantInfoUIItemTsusho = (
  tenantData: TsushoResidentTenantItem,
): CareListTenantInfo => {
  const dateOfBirth = tenantData.user.dayOfBirth;

  return {
    tenantCode: tenantData.user.tenantCode,
    kanjiName: `${tenantData.user.surnameKanji} ${tenantData.user.firstNameKanji}`,
    furiganaName: `${tenantData.user.surnameFurigana} ${tenantData.user.firstNameFurigana}`,
    photoPath: tenantData.user.photoPath,
    dateOfBirth,
    age: moment(new Date()).diff(moment(dateOfBirth), 'years'),
    isWarning: tenantData.user.hasNotice,
    nursingLevel: tenantData.user.nursingLevel ?? '',
    building: '',
    floor: '',
    room: '',
    unit: '',
    gender: convertGenderOfTenant(tenantData.user.gender),
    validityPeriod: '',
    fromDateOfCareList:
      SettingService.getDataDaysFromUserDefault().format(DATE_FORMAT),
  };
};

export const dateHeiseiStringFromDate = (date: Date) => {
  return moment(date).format(JP_HEISEI_DATE_FORMAT);
};

/**
 * Get color and content of care list's meal plan.
 *
 * @param managementId
 */
export const getCareListMealPlanText = (managementId: MealPlanManagementId) => {
  if (managementId === MealPlanManagementId.Ticket) {
    return {
      content: i18n.t('care_list.mealInstruction'),
      color: Colors.MEAL_INSTRUCTION_LIGHT_GREEN,
    };
  } else {
    return {
      content: i18n.t('care_list.mealInstructionContact'),
      color: Colors.MEAL_CONTACT_GREEN,
    };
  }
};

/**
 * Get color and content of care list's today plan.
 *
 * @param planType
 * @param planStatus
 * @param hasMultiPlans
 */
export const getCareListTodayPlanText = (
  planType: TodayPlanType,
  planStatus: TodayPlanType | null = null,
  hasMultiPlans = false,
) => {
  let color: ColorValue = '';
  let content: string = '';

  switch (planType) {
    case TodayPlanType.DayOuting:
      color = Colors.GO_OUT_LIGHT_BLUE;
      content = i18n.t('care_list.goOutAndReturnInDay');
      break;
    case TodayPlanType.OvernightOuting:
      if (hasMultiPlans) {
        color = Colors.TODAY_PLAN_DARK_BROWN;
        content = i18n.t('care_list.returnTodayThenGoSleepOvernightToday');
      } else {
        if (planStatus === TodayPlanType.OvernightOutingInProgress) {
          color = Colors.TODAY_PLAN_DARK_BROWN;
          content = i18n.t('care_list.todayOvernightSleepingOut');
        }
        if (planStatus === TodayPlanType.OvernightOutingDateOut) {
          color = Colors.TODAY_PLAN_LIGHT_BROWN;
          content = i18n.t('care_list.willGoOvernightSleepingOutToday');
        }
        if (planStatus === TodayPlanType.OvernightOutingDateBack) {
          color = Colors.TODAY_PLAN_LIGHT_BROWN;
          content = i18n.t('care_list.overnightSleepingOutAndReturnToday');
        }
      }
      break;
    case TodayPlanType.MedicalExamination:
      color = Colors.MEET_DOCTOR_LIGHT_GREEN;
      content = i18n.t('care_list.meetDoctor');
      break;
    case TodayPlanType.HavingVisitors:
      color = Colors.MEET_FAMILY_LIGHT_RED;
      content = i18n.t('care_list.meetFamily');
      break;
    case TodayPlanType.Visit:
      color = Colors.VISIT_CARING_LIGHT_GREEN;
      content = i18n.t('care_list.visit');
      break;
    case TodayPlanType.Caring:
      color = Colors.VISIT_CARING_LIGHT_GREEN;
      content = i18n.t('care_list.caring');
      break;
    case TodayPlanType.Nursing:
      color = Colors.TODAY_PLAN_LIGHT_BROWN;
      content = i18n.t('care_list.nursing');
      break;
    case TodayPlanType.Commute:
      color = Colors.COMMUTE_LIGHT_PURPLE;
      content = i18n.t('care_list.commute');
      break;
    case TodayPlanType.OvernightStay:
      color = Colors.OVERNIGHT_STAY_LIGHT_BLUE;
      content = i18n.t('care_list.overnightStay');
      break;
    case TodayPlanType.ShortTermStay:
      color = Colors.MEET_DOCTOR_LIGHT_GREEN;
      content = i18n.t('care_list.shortTermStay');
      break;
  }

  return {content, color};
};

/**
 * convert from string list to text list item list
 * @param values - list of string
 * @returns TextListItem[]
 */
export const convertFilterValuesToTextListItems = (
  values: string[],
): TextListItem[] => {
  return values.map((item, index) => {
    return {id: item + index, label: item};
  });
};

/**
 * get care list main tab UI filter structure
 */
export const getMainTabFilterStructure = () => {
  const classification = i18n.t('care_list.classification');
  const occupation = i18n.t('common.occupation');
  const reporterText = i18n.t('care_list.recordReporter');
  const cooperationRecord = i18n.t('care_list.cooperationRecord');
  const elapsed = i18n.t('care_list.elapsed');
  const vital = i18n.t('care_list.vital');
  const meal = i18n.t('care_list.meal');
  const excretion = i18n.t('care_list.excretion');
  const bath = i18n.t('care_list.bath');
  const all = i18n.t('common.all');
  const careGiver = i18n.t('care_list.careGiver');
  const nurse = i18n.t('care_list.nurse');
  const therapist = i18n.t('care_list.therapist');
  const nurseCareSupportStaff = i18n.t('care_list.nurseCareSupportStaff');
  const supportCounselor = i18n.t('care_list.supportCounselor');
  const registerDietitian = i18n.t('care_list.registerDietitian');
  const doctor = i18n.t('care_list.doctor');
  const facilityDirector = i18n.t('care_list.facilityDirector');
  const everyone = i18n.t('common.everyone');
  const systemName = i18n.t('care_list.systemName');
  const reha = i18n.t('care_list.reha');
  const letter = i18n.t('care_list.letter');
  const attendance = i18n.t('care_list.attendance');
  const medication = i18n.t('care_list.drug');
  const checkIn = i18n.t('care_list.checkIn');
  const order = i18n.t('care_list.order');
  const signature = i18n.t('care_list.signature');
  const instruction = i18n.t('care_list.instruction');
  const loginService = i18n.t('login.serviceName');
  const leaveNote = i18n.t('care_list.leaveNote');
  const other = i18n.t('common.other');

  return [
    {
      sectionTitle: classification,
      filterSection: FilterSection.Records,
      data: [
        {
          itemTitle: elapsed,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.Elapsed,
        },
        {
          itemTitle: classification,
          type: FilterRowType.Transit,
          defaultValue: all,
          transitType: TransitTabType.Elapsed,
        },
        {
          itemTitle: vital,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.ThreeOptions,
          recordType: RecordType.Vital,
        },
        {
          itemTitle: meal,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.ThreeOptions,
          recordType: RecordType.Meal,
        },
        {
          itemTitle: excretion,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.ThreeOptions,
          recordType: RecordType.Excretion,
        },
        {
          itemTitle: bath,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.ThreeOptions,
          recordType: RecordType.Bath,
        },
        // tsusho records
        {
          itemTitle: reha,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.Reha,
        },
        {
          itemTitle: letter,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.Letter,
        },
        {
          itemTitle: attendance,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.Attendance,
        },
        // medication records available at all apps if it has any data
        {
          itemTitle: medication,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.Medication,
        },
        // jutaku records
        {
          itemTitle: checkIn,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.APCheckin,
        },
        {
          itemTitle: order,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.APOrder,
        },
        {
          itemTitle: signature,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.APSignature,
        },
        {
          itemTitle: leaveNote,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.APLeaveNote,
        },
        {
          itemTitle: instruction,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          recordType: RecordType.APInstruction,
        },
      ],
    },
    {
      sectionTitle: occupation,
      filterSection: FilterSection.Occupation,
      data: [
        {
          itemTitle: careGiver,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.CareGiver,
        },
        {
          itemTitle: nurse,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.Nurse,
        },
        {
          itemTitle: therapist,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.Therapist,
        },
        {
          itemTitle: nurseCareSupportStaff,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.NurseCareSupportStaff,
        },
        {
          itemTitle: supportCounselor,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.SupportCounselor,
        },
        {
          itemTitle: registerDietitian,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.RegisterDietitian,
        },
        {
          itemTitle: doctor,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.Doctor,
        },
        {
          itemTitle: facilityDirector,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.FacilityDirector,
        },
        {
          itemTitle: other,
          type: FilterRowType.TabOptions,
          tabType: FilterTabType.TwoOptions,
          occupationType: Occupations.Other,
        },
      ],
    },
    {
      sectionTitle: reporterText,
      filterSection: FilterSection.Reporter,
      data: [
        {
          itemTitle: reporterText,
          type: FilterRowType.Transit,
          defaultValue: everyone,
          transitType: TransitTabType.Reporter,
        },
      ],
    },
    {
      sectionTitle: loginService,
      filterSection: FilterSection.LoginService,
      data: [
        {
          itemTitle: loginService,
          type: FilterRowType.Transit,
          defaultValue: all,
          transitType: TransitTabType.LoginService,
        },
      ],
    },
    {
      sectionTitle: cooperationRecord,
      filterSection: FilterSection.CooperationRecord,
      data: [
        {
          itemTitle: systemName,
          type: FilterRowType.Transit,
          defaultValue: all,
          transitType: TransitTabType.CooperationRecord,
        },
      ],
    },
  ];
};

export const getOccupationJPName = (occupation: Occupations) => {
  switch (occupation) {
    case Occupations.CareGiver:
      return '介護員';
    case Occupations.Nurse:
      return '看護師';
    case Occupations.Therapist:
      return '療法士';
    case Occupations.NurseCareSupportStaff:
      return '介護支援専門員';
    case Occupations.SupportCounselor:
      return '支援相談員';
    case Occupations.RegisterDietitian:
      return '管理栄養士';
    case Occupations.Doctor:
      return '医師';
    case Occupations.FacilityDirector:
      return '施設長';
    default:
      // case other jobs not match in enum Occupations
      return 'その他';
  }
};

export const isNormalOccupation = (checkingOccupation: string) => {
  return [
    '介護員',
    '看護師',
    '療法士',
    '介護支援専門員',
    '支援相談員',
    '管理栄養士',
    '医師',
    '施設長',
  ].includes(checkingOccupation);
};

/**
 * Split a string into an array based on a substring array.
 * @param inputStr - String to split.
 * @param substrArray - Substring array.
 * @returns An array of strings.
 */
export const splitStringFromSubStringArr = (
  inputStr: string,
  substrArray: string[],
) => {
  substrArray.sort((a, b) => b.length - a.length);

  let result: string[] = [];
  let tempSplitArr: string[] = [];

  substrArray.forEach(subStr => {
    const splitRegex = new RegExp(`(${subStr})`, 'gi');

    if (!tempSplitArr.length) {
      tempSplitArr = inputStr.split(splitRegex);
      result = [...tempSplitArr];
    } else {
      let splitChildren: string[] = [];

      tempSplitArr.forEach(tempArrChild => {
        const tempSplitChildren = tempArrChild.split(splitRegex);
        splitChildren = [...splitChildren, ...tempSplitChildren];
      });

      tempSplitArr = [...splitChildren];
      result = [...splitChildren];
    }
  });

  return result.filter(item => item !== '');
};
