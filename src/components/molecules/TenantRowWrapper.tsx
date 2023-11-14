import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {AppType} from '@modules/setting/setting.type';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import {FontWeight} from '@themes/typography';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import NavigationArrowRight from '@atoms/NavigationArrowRight';

export enum UserRowType {
  Header = 0,
  Data = 1,
}

interface ITenantRowWrapperProps {
  rowType?: UserRowType;
  renderUserInfo?: React.ReactNode;
  renderPlace?: React.ReactNode;
  renderSchedule?: React.ReactNode;
  renderUnSyncRecord?: React.ReactNode;
  renderRecordInput?: React.ReactNode;
  renderArrowBtn?: boolean;
  deepBg?: boolean;
  onPress?: () => void;
}

const windowWidth = Dimensions.get('window').width;

const TenantRowWrapper = (props: ITenantRowWrapperProps) => {
  const {
    rowType,
    renderUserInfo,
    renderPlace,
    renderSchedule,
    renderUnSyncRecord,
    renderRecordInput,
    renderArrowBtn,
    deepBg,
    onPress,
  } = props;
  const appType = useSelector(selectAppType);
  const HEIGHT_HEADER_TAKINO = 25;
  const HEIGHT_HEADER_STANDARD = 40;
  const BORDER_WIDTH_DATA = 0.5;

  const containerStyleOfTakino = [
    styles.rowTableTakino,
    rowType === UserRowType.Header && {
      backgroundColor: Colors.HEADER_GRAY,
      height: HEIGHT_HEADER_TAKINO,
    },
    deepBg && {
      backgroundColor: Colors.DEEP_WHITE,
    },
  ];

  const containerStyleOfShiJu = [
    styles.rowTableShiJu,
    rowType === UserRowType.Header && {
      backgroundColor: Colors.HEADER_GRAY,
      height: HEIGHT_HEADER_STANDARD,
    },
    deepBg && {
      backgroundColor: Colors.DEEP_WHITE,
    },
  ];

  const commonRowStyle = [
    styles.headerColumn,
    rowType === UserRowType.Data && {
      borderLeftColor: Colors.HEADER_BLUE,
      borderLeftWidth: BORDER_WIDTH_DATA,
    },
  ];

  if (appType === AppType.TAKINO) {
    return (
      <View style={containerStyleOfTakino}>
        <View style={[...commonRowStyle, styles.userInfoHeaderTakino]}>
          {renderUserInfo}
        </View>
        <View style={[...commonRowStyle, styles.scheduleHeaderTakino]}>
          {renderSchedule}
        </View>
        <View style={[...commonRowStyle, styles.unSyncRecordHeaderTakino]}>
          {renderUnSyncRecord}
        </View>
        <View style={[...commonRowStyle, styles.recordInputHeader]}>
          {renderRecordInput}
        </View>
        <BaseButton
          onPress={onPress}
          style={[...commonRowStyle, styles.arrowHeader]}>
          {renderArrowBtn && <NavigationArrowRight />}
        </BaseButton>
      </View>
    );
  }

  return (
    <View style={containerStyleOfShiJu}>
      <View style={[...commonRowStyle, styles.userInfoHeader]}>
        {renderUserInfo}
      </View>
      <View style={[...commonRowStyle, styles.placeInfoHeader]}>
        {renderPlace}
      </View>
      <View style={[...commonRowStyle, styles.scheduleHeader]}>
        {renderSchedule}
      </View>
      <View style={[...commonRowStyle, styles.unSyncRecordHeader]}>
        {renderUnSyncRecord}
      </View>
      <View style={[...commonRowStyle, styles.recordInputHeader]}>
        {renderRecordInput}
      </View>
      <BaseButton
        onPress={onPress}
        style={[...commonRowStyle, styles.arrowHeader]}>
        {renderArrowBtn && <NavigationArrowRight />}
      </BaseButton>
    </View>
  );
};

export default TenantRowWrapper;

const styles = StyleSheet.create({
  rowTableShiJu: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    height: 48,
  },
  rowTableTakino: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    height: 66,
  },
  headerColumn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.WHITE,
  },
  userInfoHeader: {
    width: 190,
    borderLeftWidth: 0,
  },
  placeInfoHeader: {
    width: 175,
  },
  scheduleHeader: {
    width: 60,
    zIndex: 99,
  },
  unSyncRecordHeader: {
    width: windowWidth - 745,
  },
  recordInputHeader: {
    width: 260,
  },
  arrowHeader: {
    width: 60,
  },
  userInfoHeaderTakino: {
    width: 220,
    borderLeftWidth: 0,
  },
  scheduleHeaderTakino: {
    width: windowWidth - 790,
    zIndex: 99,
  },
  unSyncRecordHeaderTakino: {
    width: 250,
  },
  arrowBtn: {
    color: Colors.TEXT_BLUE,
    fontWeight: FontWeight.bold,
  },
});
