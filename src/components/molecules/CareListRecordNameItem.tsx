import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Colors} from '@themes/colors';
import {hs} from '@themes/responsive';
import BaseText from '@atoms/BaseText';
import {AuthService} from '@modules/authentication/auth.service';
import {careListTableColWidths} from '@organisms/CareListTableHeader';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {RecordType} from '@modules/record/record.type';

interface Props {
  recordName: string;
  recordType: RecordType;
  photoPath: string;
  serviceCode: string | null;
}

const CareListRecordNameItem = ({
  recordName,
  recordType,
  photoPath,
  serviceCode,
}: Props) => {
  const serviceNameLogin = useAppSelector(selectChoseServiceName);
  const appType = useAppSelector(selectAppType);
  const serviceName =
    (!serviceCode || serviceCode === '-1') && appType === AppType.JUTAKU
      ? serviceNameLogin
      : serviceCode !== '-1' &&
        (appType === AppType.TAKINO || appType === AppType.JUTAKU)
      ? AuthService.getServiceNameByCode(serviceCode)
      : '';
  const elapsedPhotoView: StyleProp<ViewStyle> = {
    width: hs(50),
    height: photoPath ? hs(33) : 0,
    borderRadius: 5,
    overflow: 'hidden',
  };

  return (
    <View style={styles.container}>
      {/* elapsed photo */}
      <View style={elapsedPhotoView}>
        {photoPath && (
          <FastImage
            source={{
              uri: `file://${photoPath}?v=${Math.random()}`,
            }}
            style={styles.elapsedPhoto}
            resizeMode={'cover'}
          />
        )}
      </View>

      {/* record name */}
      <View style={styles.nameServiceContainer}>
        {serviceName && (
          <BaseText
            style={styles.baseText}
            size={'small'}
            color={Colors.GRAY_TEXT}>
            {serviceName}
          </BaseText>
        )}
        <BaseText
          size={
            recordType === RecordType.APCheckin ||
            recordType === RecordType.APCheckout
              ? 'xSmall'
              : undefined
          }>
          {recordName}
        </BaseText>
      </View>
    </View>
  );
};

export default CareListRecordNameItem;

const styles = StyleSheet.create({
  container: {
    gap: hs(10),
    flexDirection: 'row',
    width: careListTableColWidths.recordName,
    alignItems: 'flex-start',
  },
  elapsedPhoto: {
    height: '100%',
    width: '100%',
  },
  nameServiceContainer: {
    marginTop: 5,
    gap: 4,
  },
  baseText: {
    marginTop: -10,
  },
});
