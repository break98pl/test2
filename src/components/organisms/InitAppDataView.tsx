import {AxiosError} from 'axios';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useRef, useState, useEffect, useCallback, memo} from 'react';

import {
  setAdditionalServices,
  setFileStream,
} from '@modules/setting/setting.slice';
import {
  AlertConfig,
  APINoInternetError,
  APITimeoutError,
  NotSelectRoomError,
} from '@modules/errors/error.type';
import {
  selectAppType,
  selectChoseServiceName,
  setLatestSyncTime,
} from '@modules/authentication/auth.slice';
import {
  FloorAndUnitSectionData,
  FloorUnitModel,
  Room,
} from '@modules/resident/resident.type';
import {Colors} from '@themes/colors';
import {height} from '@themes/responsive';
import {AppType} from '@modules/setting/setting.type';
import {getUserLabel} from '@modules/tenant/tenant.utils';
import {TenantService} from '@modules/tenant/tenant.service';
import {useAppDispatch, useAppSelector} from '@store/config';
import {setAllTenantsData} from '@modules/tenant/tenant.slice';
import {AuthService} from '@modules/authentication/auth.service';
import {ResidentService} from '@modules/resident/resident.service';
import {APIModelForInitAppData} from '@modules/authentication/auth.type';
import {setHeadquarterSTItem} from '@modules/visitPlan/tsushoVPList.slice';
import {TsushoVisitPlanService} from '@modules/visitPlan/tsushoVPList.service';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import LoadingModal from '@molecules/LoadingModal';
import BaseTooltip from '@templates/BaseTooltip';
import RoomList from '@organisms/RoomList';
import useLogout from '@hooks/useLogout';
import useVisible from '@hooks/useVisible';
import useErrorHandler from '@hooks/useErrorHandler';
import FloorAndUnitList from '@organisms/FloorAndUnitList';
import {ScreenName} from '@navigation/type';
import {useRoute} from '@react-navigation/native';
import {RecordService} from '@modules/record/record.service';
import {setHolidays, setRecordSetting} from '@modules/record/record.slice';

const InitAppDataView = () => {
  const {t} = useTranslation();

  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [dataFetchingProgress, setDataFetchingProgress] = useState(0);
  const [sectionData, setSectionData] = useState<FloorAndUnitSectionData[]>([]);
  const [selectedFloorOrUnit, setSelectedFloorOrUnit] =
    useState<FloorUnitModel | null>(null);
  const selectedRoomCodes = useRef<string[]>([]);
  const route = useRoute();

  const {logout} = useLogout();
  const {handleAppError} = useErrorHandler();
  const {
    isVisible: isShowInitDataTooltip,
    showComponent: displayInitDataTooltip,
    hideComponent: hideInitDataTooltip,
  } = useVisible();

  const shouldShowResidentButton = [AppType.SHISETSHU, AppType.JUTAKU].includes(
    appType,
  );

  useEffect(() => {
    if (route.name !== ScreenName.TenantList) {
      return;
    } else if (shouldShowResidentButton) {
      handleGenerateResidentSections().then();
    } else {
      startInitData().then();
    }
  }, []);

  const handleInitDataError = (e: any, fetchAgainCallback: () => void) => {
    let alertConfig: AlertConfig = {};
    if (
      e instanceof APINoInternetError ||
      e instanceof APITimeoutError ||
      e instanceof AxiosError
    ) {
      alertConfig = {
        title: t('common.warning'),
        message: t('user_list.err_get_data_from_server'),
        buttons: [
          {
            text: t('common.logout'),
            style: 'destructive',
            onPress: logout,
          },
          {
            text: t('user_list.fetch_again'),
            onPress: fetchAgainCallback,
          },
        ],
      };
    }

    handleAppError(e, alertConfig);
  };

  /**
   * Generate resident sections data.
   *
   * @appType Shisetsu & Jutaku.
   */
  const handleGenerateResidentSections = useCallback(async () => {
    try {
      setLoading(true);
      let data: FloorAndUnitSectionData[] = [];
      if (appType === AppType.SHISETSHU) {
        data = await ResidentService.getResidentSectionDataForShisetsu();
      } else if (appType === AppType.JUTAKU) {
        data = await ResidentService.getResidentSectionDataForJutaku();
      }
      setSectionData(data);
      setLoading(false);
      displayInitDataTooltip();
    } catch (e: any) {
      setLoading(false);
      handleInitDataError(e, handleGenerateResidentSections);
    }
  }, []);

  /**
   * Generate user list screen data.
   * Called when application data initialization has completed.
   */
  const generateAppReduxStates = useCallback(async () => {
    const holidays: string[] = await RecordService.getHolidays();
    const recordSetting = await RecordService.getCareListRecordSetting();
    const tenantListData = await TenantService.getUserListScreenData(appType);
    if (appType === AppType.TSUSHO) {
      const listSateLite = await TsushoVisitPlanService.getDataSatelites(
        tenantListData,
      );
      dispatch(setHeadquarterSTItem(listSateLite));
    }
    dispatch(setHolidays(holidays));
    dispatch(setRecordSetting({recordSetting}));
    dispatch(setAllTenantsData({allTenants: tenantListData}));
    dispatch(setLatestSyncTime({time: new Date().toISOString()}));
  }, []);

  /**
   * Handle fetch data for each API and update UI:
   *   1. Update loading indicator percent.
   *
   * @param APIs
   */
  const handleFetchDataFromAPIList = async (APIs: APIModelForInitAppData[]) => {
    const length = APIs.length;
    for (let i = 0; i < length; i++) {
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI(
        APIs[i],
      );
      if (errorMsg) {
        console.error('Error at handleFetchDataFromAPIList: ', errorMsg);
      } else {
        setDataFetchingProgress(Math.round(((i + 1) * 10) / length) / 10);
      }
    }
  };

  /**
   * Called when user:
   *   1. Select all tenants options.
   *   2. App type is Takino or Tsusho.
   *   3. select rooms or units then press "decision" button.
   */
  const startInitData = useCallback(async () => {
    try {
      setLoading(true);
      await AuthService.deleteTableDataBeforeInit();

      const selectedRooms =
        selectedFloorOrUnit?.rooms.filter(room =>
          selectedRoomCodes.current.includes(room.code),
        ) ?? [];
      const tenantCodes = selectedRooms.reduce((acc: string[], curr: Room) => {
        const codes = curr.tenants
          .map(e => e.fkKey)
          .filter(e => !!e) as string[];
        acc.push(...codes);
        return acc;
      }, []);

      if (appType === AppType.TSUSHO) {
        //prepare data for Tsusho before get list api will call
        const {additionalServices, checkStream} =
          await AuthService.prepareDataBeforeCallAPIListForTsusho();
        dispatch(
          setAdditionalServices({additionalServices: additionalServices}),
        );
        dispatch(setFileStream({fileStream: checkStream}));
      }
      const APIs = await AuthService.getAPIListToInitAppData(
        appType,
        tenantCodes,
        selectedRoomCodes.current,
      );
      await handleFetchDataFromAPIList(APIs);
      setDataFetchingProgress(0);

      await AuthService.removeUnusedTableDataAfterInitSuccessfully(appType);
      await AuthService.initPhotosData(appType);

      setSelectedFloorOrUnit(null);

      // After generate app data, load all tenants from SQLite and save to Redux
      await generateAppReduxStates();
    } catch (e: any) {
      handleInitDataError(e, startInitData);
      console.error('Error at startInitData: ', e);
    } finally {
      setLoading(false);
    }
  }, [selectedFloorOrUnit, appType]);

  /**
   * Called when user select a room in resident tooltip.
   */
  const setSelectedRoomCodes = useCallback((roomCodes: string[]) => {
    selectedRoomCodes.current = roomCodes;
  }, []);

  /**
   * Called when user select a floor or unit on Resident tooltip.
   */
  const handleSelectFloorOrUnit = useCallback(
    (item: FloorUnitModel) => {
      if (item.id === '1') {
        hideInitDataTooltip();
        startInitData().then();
      } else {
        setSelectedFloorOrUnit(item);
        // By default, all non-empty rooms of the floor or the unit are selected.
        setSelectedRoomCodes(
          item.rooms.filter(r => r.tenants.length > 0).map(r => r.code),
        );
      }
    },
    [startInitData],
  );

  /**
   * Called when user press left button of resident tooltip.
   */
  const handleBackPress = useCallback(() => {
    if (selectedFloorOrUnit) {
      setSelectedFloorOrUnit(null);
      setSelectedRoomCodes([]);
    } else {
      hideInitDataTooltip();
    }
  }, [selectedFloorOrUnit]);

  /**
   * Called when user press "decision" button on the right of resident tooltip.
   */
  const handlePressDecisionButton = useCallback(() => {
    /* Display an error alert if the user presses the 'decision' button
       without selecting any room before.*/
    if (selectedRoomCodes.current.length === 0) {
      handleAppError(new NotSelectRoomError());
    } else {
      hideInitDataTooltip();
      startInitData().then();
    }
  }, [startInitData]);

  return (
    <>
      {shouldShowResidentButton && (
        <BaseTooltip
          title={
            selectedFloorOrUnit
              ? t('common.room_selection')
              : t('common.selection_method')
          }
          showHeader
          leftButtonText={
            selectedFloorOrUnit
              ? t('common.selection_method')
              : t('common.close')
          }
          useReactNativeModal={false}
          showBackIcon={!!selectedFloorOrUnit}
          rightButtonText={selectedFloorOrUnit ? t('common.decision') : ''}
          rightButtonStyle={selectedFloorOrUnit && styles.decisionButton}
          onRightButtonPress={handlePressDecisionButton}
          onLeftButtonPress={handleBackPress}
          isVisible={isShowInitDataTooltip}
          onClose={hideInitDataTooltip}
          headerStyle={styles.tooltipHeader}
          contentStyle={styles.residentTooltip}
          closeOnBackgroundInteraction={false}
          content={
            selectedFloorOrUnit === null ? (
              <FloorAndUnitList
                appType={appType}
                sections={sectionData}
                onSelectFloorOrUnit={handleSelectFloorOrUnit}
              />
            ) : (
              <RoomList
                title={selectedFloorOrUnit.title}
                data={selectedFloorOrUnit.rooms}
                onSelectRoom={setSelectedRoomCodes}
              />
            )
          }>
          <BaseButton
            style={styles.residentButton}
            onPress={handleGenerateResidentSections}>
            <BaseText
              size="xxLarge"
              color={Colors.TEXT_BLUE}
              text={t(getUserLabel(appType, serviceName), {text: '取得'})}
            />
          </BaseButton>
        </BaseTooltip>
      )}
      <LoadingModal
        type={'pie'}
        visible={loading}
        progress={dataFetchingProgress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  residentButton: {},
  residentTooltip: {
    minWidth: 400,
    maxHeight: height,
  },
  tooltipHeader: {
    backgroundColor: Colors.WHITE,
  },
  decisionButton: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderColor: Colors.PRIMARY,
  },
});

export default memo(InitAppDataView);
