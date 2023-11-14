import _ from 'lodash';
import i18n from 'i18next';
import moment from 'moment';
import {getReduxStates} from '@store/helper';
import {AppType} from '@modules/setting/setting.type';
import {
  APIModelForInitAppData,
  AuthState,
} from '@modules/authentication/auth.type';
import {cTenantData} from '@database/models/various-registration-information-data/cTenantData';
import {
  BriefServicePlanItem,
  FilteringConditions,
  Gender,
  GoingOutPlan,
  ServicePlan,
  SortingConditions,
  SortingType,
  TenantListItem,
  TenantListSection,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {Room} from '@modules/resident/resident.type';
import {TenantDB} from '@modules/tenant/tenant.db';
import {DATE_FORMAT, MIX_KATAKANA_CHARACTERS} from '@constants/constants';
import {
  compareJapaneseCharacter,
  convertHalfWidthKatakanaToKatakana,
  convertHiraganaToHalfWidthKatakana,
  getTextFromFilterType,
} from '@modules/tenant/tenant.utils';
import {START_WITH_KATAKANA_CHARACTER_REGEX} from '@modules/tenant/tenant.constant';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';
import {FileService} from '@modules/files/file.service';
import {TableName} from '@database/type';
import {AuthService} from '@modules/authentication/auth.service';
import {Validator} from '@database/models/functional-model/Validator';
import {RecordService} from '@modules/record/record.service';
import {SettingService} from '@modules/setting/setting.service';

export namespace TenantService {
  /**
   * Generate user list screen data.
   *
   * @return TenantListItem[]
   *
   * @appType Shisetsu & Jutaku
   */
  const getTenantDataForShisetsuAndJutaku = async (): Promise<
    TenantListItem[]
  > => {
    const tenantList = await TenantDB.findAllTenants();
    const tenantNotes = await TenantDB.findAllNotes();
    const roomList = await TenantDB.findAllRooms();
    const reservationList = await TenantDB.findAllRoomSchedule();
    const allGoingOutPlans = await TenantDB.findGoingOutPlans();
    const allRecords = await RecordService.getAllRecords();
    const mealPlans = await RecordService.getMealPlans();

    const tenantPhotoPath: Record<string, string | null> = {};
    for (const tenant of tenantList) {
      tenantPhotoPath[tenant.fkKey!] = await FileService.getPhotoPathByKey(
        tenant.photoKey ?? '',
      );
    }

    return tenantList
      .reduce((acc: TenantListItem[], curr: cTenantData) => {
        const reservations = reservationList.filter(
          r => r.tenantCode === curr.fkKey,
        );
        for (const reservation of reservations) {
          const room = roomList.find(r => r.code === reservation.roomCode);
          if (room) {
            acc.push({
              // Tenant information
              tenantCode: curr.fkKey ?? '',
              surnameFurigana: curr.lastNameFurigana ?? '',
              firstNameFurigana: curr.firstNameFurigana ?? '',
              surnameKanji: curr.lastName ?? '',
              firstNameKanji: curr.firstName ?? '',
              gender: (curr.gender as Gender) ?? Gender.Female,
              photoPath: tenantPhotoPath[curr.fkKey!] ?? null,
              hasNotice:
                tenantNotes.findIndex(n => n.tenantCode === curr.fkKey) > -1,
              dayOfBirth: curr.dayOfBirth ?? '',
              nursingLevel: curr.nursingLevel ?? '',
              careFromDate:
                SettingService.getDataDaysFromUserDefault().format(DATE_FORMAT),
              mealPlans: mealPlans.filter(p => p.tenantCode === curr.fkKey),
              records: allRecords.filter(r => r.tenantCode === curr.fkKey),

              // Room information
              room: {
                code: room.code,
                name: room.roomName,
                buildingName: room.buildingName,
                floorName: `${room.code.substring(1, 2)}${i18n.t(
                  'user_list.floor',
                )}`,
                unit: room.notes,
                tenants: [],
              },
              // Reservation information
              reservation: {
                startDate: reservation.startDate,
                endDate: reservation.endDate,
              },
              // Going out plans within the period of room's reservation.
              goingOutPlans: allGoingOutPlans.filter(
                plan =>
                  plan.tenantCode === curr.fkKey &&
                  plan.startDate >= reservation.startDate &&
                  plan.endDate <= reservation.endDate,
              ),
            });
          }
        }
        return acc;
      }, [])
      .sort((a: TenantListItem, b: TenantListItem) =>
        compareJapaneseCharacter(
          a.surnameFurigana + a.firstNameFurigana,
          b.surnameFurigana + b.firstNameFurigana,
        ),
      );
  };

  /**
   * Generate user list screen data.
   *
   * @return TenantListItem[]
   *
   * @appType Takino
   */
  const getTenantDataForTakinoAndTsusho = async (): Promise<
    TenantListItem[]
  > => {
    const tenantList = await TenantDB.findAllTenants();
    const tenantNotes = await TenantDB.findAllNotes();
    const allServicePlans = await TenantDB.findServicePlans();
    const allRecords = await RecordService.getAllRecords();

    const tenantPhotoPath: Record<string, string | null> = {};
    for (const tenant of tenantList) {
      tenantPhotoPath[tenant.fkKey!] = await FileService.getPhotoPathByKey(
        tenant.photoKey ?? '',
      );
    }

    return tenantList
      .reduce((acc: TenantListItem[], curr: cTenantData) => {
        acc.push({
          tenantCode: curr.fkKey ?? '',
          surnameFurigana: curr.lastNameFurigana ?? '',
          firstNameFurigana: curr.firstNameFurigana ?? '',
          surnameKanji: curr.lastName ?? '',
          firstNameKanji: curr.firstName ?? '',
          gender: (curr.gender as Gender) ?? Gender.Female,
          photoPath: tenantPhotoPath[curr.fkKey!],
          hasNotice:
            tenantNotes.findIndex(n => n.tenantCode === curr.fkKey) > -1,
          dayOfBirth: curr.dayOfBirth ?? '',
          servicePlans: allServicePlans.filter(
            plan => plan.tenantCode === curr.fkKey,
          ),
          nursingLevel: curr.nursingLevel ?? '',
          careFromDate:
            SettingService.getDataDaysFromUserDefault().format(DATE_FORMAT),
          records: allRecords.filter(r => r.tenantCode === curr.fkKey),

          //only Tsusho
          hasAttention: curr.hasAttention ? curr.hasAttention : false,
          isNotKana: curr.isNotKana ?? false,
          kanaNameFullWidth: curr.kanaNameFullWidth ?? '',
        });
        return acc;
      }, [])
      .sort((a: TenantListItem, b: TenantListItem) =>
        compareJapaneseCharacter(
          a.surnameFurigana + a.firstNameFurigana,
          b.surnameFurigana + b.firstNameFurigana,
        ),
      );
  };

  /**
   * Generate user list screen data.
   *
   * @appType Takino
   * @return
   */
  export const getUserListScreenData = async (
    appType: AppType,
  ): Promise<TenantListItem[]> => {
    switch (appType) {
      case AppType.SHISETSHU:
      case AppType.JUTAKU:
        return await getTenantDataForShisetsuAndJutaku();
      case AppType.TAKINO:
      case AppType.TSUSHO:
        return await getTenantDataForTakinoAndTsusho();
      default:
        return [];
    }
  };

  /**
   * Filters a tenant item based on a character filter.
   *
   * @param tenantItem The tenant item to be filtered.
   * @param filteringCharacter The character used for filtering.
   * @return {boolean} A boolean indicating whether the tenant item meets the character-based filtering condition.
   */
  export const filterTenantByCharacter = (
    tenantItem: TenantListItem,
    filteringCharacter: string,
  ): boolean => {
    let result = true;
    // Check whether filtering by character line
    const halfWidthKatakanaChar = convertHiraganaToHalfWidthKatakana(
      filteringCharacter.charAt(0),
    );
    const fullWidthKatakana = convertHalfWidthKatakanaToKatakana(
      halfWidthKatakanaChar,
    );
    const firstCharacterOfTenantName = tenantItem.surnameFurigana.charAt(0);
    if (filteringCharacter.includes('行')) {
      const charLine = MIX_KATAKANA_CHARACTERS.find(
        e => e[0] === fullWidthKatakana,
      );
      result =
        result && !!charLine?.some(char => firstCharacterOfTenantName === char);
    }
    // Then filter by hiragana character
    else if (filteringCharacter !== 'all' && filteringCharacter !== 'other') {
      result =
        result &&
        (firstCharacterOfTenantName === halfWidthKatakanaChar ||
          firstCharacterOfTenantName === fullWidthKatakana);
    } else if (filteringCharacter === 'other') {
      result =
        result &&
        !START_WITH_KATAKANA_CHARACTER_REGEX.test(tenantItem.surnameFurigana);
    }
    return result;
  };

  /**
   * Check whether the tenant item is passed the filtering conditions or not.
   *
   * @param tenantItem
   * @param conditions
   */
  const isValidTenantItem = (
    tenantItem: TenantListItem,
    {filteringDate, filteringCharacter}: FilteringConditions,
  ) => {
    let result: boolean = true;

    // Only Shisetsu & Jutaku, filter by reservation date
    const {startDate, endDate} = tenantItem.reservation || {};
    if (startDate && endDate) {
      result =
        result &&
        moment(filteringDate).isBetween(startDate, endDate, 'date', '[]');
    }
    // Filter by filtering character
    result = result && filterTenantByCharacter(tenantItem, filteringCharacter);
    return result;
  };

  /**
   * Get the status of overnight outing plan, it can be one of the following:
   *   1. Date out: The tenant starts going out at the "checking date".
   *   2. In progress: The tenant has gone out and will not come back at the "checking date".
   *   3. Date back: The tenant will come back at the "checking date".
   *
   * @param planStartDate
   * @param planEndDate
   * @param checkingDate
   *
   * @appType Shisetsu & Jutaku
   */
  const getOvernightOutingStatus = (
    planStartDate: string,
    planEndDate: string,
    checkingDate: string,
  ) => {
    let overnightPlanStatus = TodayPlanType.Unknown;

    if (checkingDate === planStartDate) {
      overnightPlanStatus = TodayPlanType.OvernightOutingDateOut;
    } else if (checkingDate === planEndDate) {
      overnightPlanStatus = TodayPlanType.OvernightOutingDateBack;
    } else if (checkingDate > planStartDate && checkingDate < planEndDate) {
      overnightPlanStatus = TodayPlanType.OvernightOutingInProgress;
    }

    return overnightPlanStatus;
  };

  /**
   * Filter going out plan by date.
   *
   * @param goingOutPlans
   * @param filteringDate
   */
  export const filterGoingOutPlanByDate = (
    goingOutPlans: GoingOutPlan[],
    filteringDate: string, // YYYY-MM-DD
  ): GoingOutPlan[] => {
    return goingOutPlans.reduce((result: GoingOutPlan[], plan) => {
      const planStartDate = plan.startDate.slice(0, 10); // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD
      const planEndDate = plan.endDate.slice(0, 10); // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD

      if (filteringDate >= planStartDate && filteringDate <= planEndDate) {
        if (plan.planType === TodayPlanType.OvernightOuting) {
          result.push({
            ...plan,
            goingOutStatus: getOvernightOutingStatus(
              planStartDate,
              planEndDate,
              filteringDate,
            ),
          });
        } else {
          result.push(plan);
        }
      }

      return result;
    }, []);
  };

  /**
   * Filter going out plan by date.
   *
   * @param servicePlans
   * @param filteringDate
   */
  export const filterServicePlansByDate = (
    servicePlans: ServicePlan[],
    filteringDate: string, // YYYY-MM-DD
  ): ServicePlan[] => {
    return servicePlans.filter(plan => {
      const planStartDate = plan.startDate.slice(0, 10); // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD
      const planEndDate = plan.endDate.slice(0, 10); // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD
      return filteringDate >= planStartDate && filteringDate <= planEndDate;
    });
  };

  /**
   * Check if tenant stayed overnight at facility.
   *
   * @param servicePlans
   * @param filteringDate
   */
  export const checkHasPreviousOvernightStay = (
    servicePlans: ServicePlan[],
    filteringDate: string,
  ): boolean => {
    const previousDate = moment(filteringDate)
      .subtract(1, 'day')
      .format(DATE_FORMAT);

    return servicePlans.some(plan => {
      const planStartDate = plan.startDate.slice(0, 10); // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD
      return (
        previousDate === planStartDate &&
        [TodayPlanType.OvernightStay, TodayPlanType.ShortTermStay].includes(
          plan.planType,
        )
      );
    });
  };

  /**
   * Check if a tenant item has service plan or not.
   *
   * @param tenantItem
   * @appType Takino
   */
  const hasServicePlan = (tenantItem: TenantListItem) => {
    return (
      tenantItem.servicePlans?.length || tenantItem.hasPreviousOvernightStay
    );
  };

  /**
   * Filter tenant list items to match with date and character.
   *
   * @param tenants
   * @param conditions {FilteringConditions}
   */
  const filterTenantItems = (
    tenants: TenantListItem[],
    conditions: FilteringConditions,
  ): TenantListItem[] => {
    return tenants.reduce((acc: TenantListItem[], tenant) => {
      if (!isValidTenantItem(tenant, conditions)) {
        return acc;
      }
      acc.push({
        ...tenant,
        goingOutPlans: filterGoingOutPlanByDate(
          tenant.goingOutPlans ?? [],
          conditions.filteringDate,
        ),
        servicePlans: filterServicePlansByDate(
          tenant.servicePlans ?? [],
          conditions.filteringDate,
        ),
        hasPreviousOvernightStay: checkHasPreviousOvernightStay(
          tenant.servicePlans ?? [],
          conditions.filteringDate,
        ),
        records: tenant.records,
        mealPlans: [],
      });
      return acc;
    }, []);
  };

  /**
   * Create the data of tenant section list which is sorted by Japanese alphabet.
   *
   * @appType Shisetsu, Jutaku & Takino
   */
  const createTenantListSortByAlphabet = (
    tenants: TenantListItem[],
  ): TenantListSection[] => {
    const {appType} = getReduxStates('authentication') as AuthState;

    const result: TenantListSection[] = [];
    let noPlanTenants: TenantListItem[] = [];
    let dataToSort: TenantListItem[] = tenants;

    // Only Takino
    // Priority to sort tenant items that have service plans.
    if (appType === AppType.TAKINO) {
      dataToSort = [];
      for (const tenantItem of tenants) {
        if (hasServicePlan(tenantItem)) {
          dataToSort.push(tenantItem);
        } else {
          noPlanTenants.push(tenantItem);
        }
      }
    }

    for (const charLine of MIX_KATAKANA_CHARACTERS) {
      const representativeChar = charLine[0];
      const filteredTenants = dataToSort.filter(t =>
        charLine.some(char => t.surnameFurigana.startsWith(char)),
      );
      if (filteredTenants.length) {
        result.push({
          id: representativeChar,
          title: `${representativeChar}${i18n.t('common.line')}`,
          data: filteredTenants,
        });
      }
    }

    const nonKatakanaTenants = dataToSort.filter(t =>
      MIX_KATAKANA_CHARACTERS.flat().every(
        char => !t.surnameFurigana.startsWith(char),
      ),
    );
    if (nonKatakanaTenants.length) {
      result.push({
        id: '0',
        title: i18n.t('common.other'),
        data: nonKatakanaTenants,
      });
    }

    // Only Takino
    if (noPlanTenants.length) {
      result.push({
        id: 'no-plans-section',
        title: i18n.t('user_list.no_service_plans'),
        data: noPlanTenants,
      });
    }

    return result;
  };

  /**
   * Create the data of tenant section list which is sorted by room.
   *
   * @appType Shisetsu, Jutaku
   */
  const createTenantListSortByRoom = (
    tenants: TenantListItem[],
  ): TenantListSection[] => {
    return tenants
      .reduce((acc: TenantListSection[], curr: TenantListItem) => {
        const room = curr.room as Room;
        const roomId = `${room.buildingName}-${room.name}`;
        const index = acc.findIndex(s => s.id === roomId);
        if (index > -1) {
          acc[index].data.push(curr);
        } else {
          acc.push({
            id: `${room.buildingName}-${room.name}`,
            title: `${room.buildingName}      ${room.floorName}      ${room.name}`,
            data: [curr],
          });
        }
        return acc;
      }, [])
      .sort((sectionA, sectionB) => {
        const collator = new Intl.Collator('ja-JP');
        if (
          sectionA.id.indexOf('本館') === 0 &&
          sectionB.id.indexOf('本館') !== 0
        ) {
          return -1;
        } else if (
          sectionA.id.indexOf('本館') !== 0 &&
          sectionB.id.indexOf('本館') === 0
        ) {
          return 1;
        } else {
          return collator.compare(sectionA.id, sectionB.id);
        }
      });
  };

  /**
   * Create the data of tenant section list which is sorted by unit.
   *
   * @appType Shisetsu, Jutaku
   */
  const createTenantListSortByUnit = (
    tenants: TenantListItem[],
  ): TenantListSection[] => {
    const result: TenantListSection[] = [];
    const unspecificUnitSection: TenantListSection = {
      id: '未指定',
      title: '未指定',
      data: [],
    };

    const tenantSortedByRoom = _.sortBy(tenants, 'room.name');
    for (const tenant of tenantSortedByRoom) {
      const room = tenant.room as Room;
      const unit = room.unit;
      if (!unit) {
        unspecificUnitSection.data.push(tenant);
        continue;
      }
      const index = result.findIndex(t => t.id === unit);
      if (index > -1) {
        result[index].data.push(tenant);
      } else {
        result.push({
          id: unit,
          title: unit,
          data: [tenant],
        });
      }
    }

    if (unspecificUnitSection.data.length) {
      result.push(unspecificUnitSection);
    }
    return _.sortBy(result, 'id');
  };

  /**
   * Create tenant section data sorting by specific service plan.
   *
   * @param tenantItems
   * @param sortBy
   * @appType Takino
   */
  const createTenantListSortByServicePlan = (
    tenantItems: TenantListItem[],
    sortBy: SortingType,
  ): TenantListSection[] => {
    let planType = TodayPlanType.Unknown;

    switch (sortBy) {
      case SortingType.ByVisitPlan:
        planType = TodayPlanType.Visit;
        break;
      case SortingType.ByCaringPlan:
        planType = TodayPlanType.Caring;
        break;
      case SortingType.ByNursingPlan:
        planType = TodayPlanType.Nursing;
        break;
      case SortingType.ByCommutePlan:
        planType = TodayPlanType.Commute;
        break;
      case SortingType.ByOvernightPlan:
        planType = TodayPlanType.OvernightStay;
        break;
      case SortingType.ByShortTermPlan:
        planType = TodayPlanType.ShortTermStay;
        break;
      default:
        break;
    }

    // An array of tenant items whose service plans include at least 1 service of the "planType".
    let tenantItemsHasPlanType: TenantListItem[] = [];

    // An array of tenant items that have no service plans.
    const noPlanTenantItems: TenantListItem[] = [];

    // An array of tenant items that have at least 1 service plan but do not have any services of the 'planType'.
    const havingPlanTenantItems: TenantListItem[] = [];

    for (const tenantItem of tenantItems) {
      if (hasServicePlan(tenantItem)) {
        if (tenantItem.servicePlans?.some(e => e.planType === planType)) {
          tenantItemsHasPlanType.push(tenantItem);
        } else {
          havingPlanTenantItems.push(tenantItem);
        }
      } else {
        noPlanTenantItems.push(tenantItem);
      }
    }

    return [
      {
        id: planType,
        title: i18n.t(getTextFromFilterType(sortBy)),
        data: [
          ...tenantItemsHasPlanType, // priority 1
          ...havingPlanTenantItems, // priority 2
          ...noPlanTenantItems, // priority 3
        ],
      },
    ];
  };

  /**
   * Create tenant section data sorting by previous overnight.
   *
   * @param tenantItems
   */
  const createTenantListSortByPreviousOvernight = (
    tenantItems: TenantListItem[],
  ) => {
    // An array of tenant items whose service plans include at least 1 service of the "planType".
    let tenantItemsHasPlanType: TenantListItem[] = [];

    // An array of tenant items that have no service plans.
    const noPlanTenantItems: TenantListItem[] = [];

    // An array of tenant items that have at least 1 service plan but do not have any services of the 'planType'.
    const havingPlanTenantItems: TenantListItem[] = [];

    for (const tenantItem of tenantItems) {
      if (tenantItem.hasPreviousOvernightStay) {
        tenantItemsHasPlanType.push(tenantItem);
      } else if (tenantItem.servicePlans?.length) {
        havingPlanTenantItems.push(tenantItem);
      } else {
        noPlanTenantItems.push(tenantItem);
      }
    }

    return [
      {
        id: TodayPlanType.HasPreviousOvernightStay,
        title: i18n.t(
          getTextFromFilterType(SortingType.ByPreviousOvernightPlan),
        ),
        data: [
          ...tenantItemsHasPlanType, // priority 1
          ...havingPlanTenantItems, // priority 2
          ...noPlanTenantItems, // priority 3
        ],
      },
    ];
  };

  /**
   * Create the data of tenant section list with the sorting condition.
   *
   * @param tenantItems
   * @param sortBy
   */
  const sortTenantItems = (
    tenantItems: TenantListItem[],
    sortBy: SortingType,
  ): TenantListSection[] => {
    let result: TenantListSection[];
    switch (sortBy) {
      case SortingType.ByAlphabet:
        result = createTenantListSortByAlphabet(tenantItems);
        break;
      /* ------- Only Shisetsu & Jutaku ------- */
      case SortingType.ByRoom:
        result = createTenantListSortByRoom(tenantItems);
        break;
      case SortingType.ByUnit:
        result = createTenantListSortByUnit(tenantItems);
        break;
      /* ------------ Only Takino ----------- */
      case SortingType.ByVisitPlan:
      case SortingType.ByCaringPlan:
      case SortingType.ByNursingPlan:
      case SortingType.ByCommutePlan:
      case SortingType.ByOvernightPlan:
      case SortingType.ByShortTermPlan:
        result = createTenantListSortByServicePlan(tenantItems, sortBy);
        break;
      case SortingType.ByPreviousOvernightPlan:
        result = createTenantListSortByPreviousOvernight(tenantItems);
        break;
      default:
        result = [];
        break;
    }

    return result;
  };

  /**
   * Create data of tenant section list to match with options.
   * Ex: filter by date, alphabet & sort by tenant name, room or unit.
   *
   * @param allTenants
   * @param conditions
   *
   * @appType Shisetsu, Jutaku & Takino
   */
  export const generateTenantSectionDataForShiJuTa = (
    allTenants: TenantListItem[],
    conditions: FilteringConditions & SortingConditions,
  ): TenantListSection[] => {
    const filteredTenants: TenantListItem[] = filterTenantItems(
      allTenants,
      conditions,
    );
    return sortTenantItems(filteredTenants, conditions.sortBy);
  };

  /**
   * Create data of plan list for tenant item to showing in UserList screen.
   *
   * @param servicePlans
   * @appType Takino
   */
  export const getBriefServicePlanData = (
    servicePlans: ServicePlan[],
  ): BriefServicePlanItem[] => {
    const result: BriefServicePlanItem[] = [];
    const visits: ServicePlan[] = [];
    const caring: ServicePlan[] = [];
    const nursing: ServicePlan[] = [];
    const commutes: ServicePlan[] = [];
    const overnights: ServicePlan[] = [];
    const shortTerms: ServicePlan[] = [];
    const isKantaki = getUserDefaultKeyMultiService() === '2';

    for (const plan of servicePlans) {
      switch (plan.planType) {
        case TodayPlanType.Visit:
          visits.push(plan);
          break;
        case TodayPlanType.Caring:
          caring.push(plan);
          break;
        case TodayPlanType.Nursing:
          nursing.push(plan);
          break;
        case TodayPlanType.Commute:
          commutes.push(plan);
          break;
        case TodayPlanType.OvernightStay:
          overnights.push(plan);
          break;
        case TodayPlanType.ShortTermStay:
          shortTerms.push(plan);
          break;
        default:
          break;
      }
    }

    if (isKantaki) {
      result.push(
        ...[
          {
            id: TodayPlanType.Nursing,
            count: nursing.length,
          },
          {
            id: TodayPlanType.Caring,
            count: caring.length,
          },
        ],
      );
    } else {
      result.push({
        id: TodayPlanType.Visit,
        count: visits.length,
      });
    }

    result.push({
      id: TodayPlanType.Commute,
      count: commutes.length,
    });

    if (overnights.length > 0) {
      result.push({
        id: TodayPlanType.OvernightStay,
        count: overnights.length,
      });
    } else {
      result.push({
        id: TodayPlanType.ShortTermStay,
        count: shortTerms.length,
      });
    }

    return result;
  };

  /**
   * Fetch going out plan of the tenant.
   *
   * @param tenantCodes
   * @param fromDate
   * @param toDate
   *
   * @appType Shisetsu & Jutaku
   */
  export const fetchTenantGoingOutPlans = async (
    tenantCodes: string[],
    fromDate: string,
    toDate: string,
  ) => {
    const numOfDay = moment(toDate).diff(fromDate, 'day') + 1;
    const apiConfig: APIModelForInitAppData = {
      type: 1,
      tableName: TableName.Overnight,
      query: `type=read&case=overnight&key=${tenantCodes.join(
        ',',
      )}&fromdate=${fromDate}&todate=${toDate}&days=${numOfDay}`,
      notDelete: true,
    };
    const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI(
      apiConfig,
    );
    if (errorMsg) {
      console.error('Error at fetchTenantGoingOutPlan: ', errorMsg);
    }
  };

  /**
   * Fetch service plans of the tenant.
   *
   * @param tenantCodes
   * @param fromDate
   * @param toDate
   *
   * @appType Shisetsu & Jutaku
   */
  export const fetchTenantServicePlans = async (
    tenantCodes: string[],
    fromDate: string,
    toDate: string,
  ) => {
    const isKantaki = getUserDefaultKeyMultiService() === '2';
    const serviceNo = isKantaki ? 77 : 73;
    const serviceNoTanki = isKantaki ? 79 : 68;
    const validator: Validator = new Validator();

    const monthlyPlanSql = validator.sqlQueryForMonthPlanWithBasisDate(
      moment(fromDate).toDate(),
      serviceNo,
      moment(toDate).toDate(),
      tenantCodes,
    );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyPlan, //T_予定管理_居宅月間
      query: monthlyPlanSql,
      notDelete: true,
    });

    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyPlan, //T_予定管理_居宅月間
      query: validator.sqlQueryForMonthPlanWithBasisDate(
        moment(fromDate).toDate(),
        serviceNoTanki,
        moment(toDate).toDate(),
        tenantCodes,
      ),
      notDelete: true,
    });

    const monthlyResultSql = validator.sqlQueryForMonthResultsWithBasisDate(
      moment(fromDate).toDate(),
      serviceNo,
      moment(toDate).toDate(),
      tenantCodes,
    );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyResult, //T_実績管理_居宅_月間
      query: monthlyResultSql,
      notDelete: true,
    });

    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyResult, //T_実績管理_居宅_月間
      query: validator.sqlQueryForMonthResultsWithBasisDate(
        moment(fromDate).toDate(),
        serviceNoTanki,
        moment(toDate).toDate(),
        tenantCodes,
      ),
      notDelete: true,
    });
  };

  /**
   * Get all today plans of a tenant.
   *
   * @param tenantCode
   * @appType Shisetsu, Jutaku & Takino
   */
  export const getTodayPlansOfTenant = async (
    tenantCode: string,
  ): Promise<GoingOutPlan[] | ServicePlan[]> => {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) {
      return await TenantDB.findGoingOutPlans(tenantCode);
    } else if (appType === AppType.TAKINO) {
      return await TenantDB.findServicePlans(tenantCode);
    } else {
      return [];
    }
  };
}
