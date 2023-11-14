import {StyleSheet, View} from 'react-native';
import React from 'react';
import UserInfoReha from './UserInfoReha';
import RecordInfoReha, {TRehaInfo, TRehaInfoChange} from './RecordInfoReha';
import {useTranslation} from 'react-i18next';

interface IRehaContentHeaderProps {
  data: TRehaInfo;
  onChange: (e: TRehaInfoChange) => void;
}

const RehaContentHeader = (props: IRehaContentHeaderProps) => {
  const {data, onChange} = props;
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <UserInfoReha
        data={data.userInfo}
        attendanceStatus={t('popover.attendance_providing_service').slice(0, 3)}
      />
      <RecordInfoReha data={data} onChange={onChange} />
    </View>
  );
};

export default RehaContentHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 40,
  },
});
