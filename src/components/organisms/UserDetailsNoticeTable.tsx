import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import InfoTable from '@organisms/InfoTable';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {dummyNoticeTableContent} from '@modules/userDetails/dummyData';

type Props = {
  isNotice?: boolean;
};

const UserDetailsNoticeTable = ({isNotice}: Props) => {
  const {t} = useTranslation();

  const notesText = t('user_details.notes');
  const notRegisterNotesText = t('user_details.notRegisterNotes');
  const classificationText = t('user_details.classification');
  const reporterText = t('user_details.reporter');
  const dateText = t('user_details.date');
  const importanceText = t('user_details.importance');
  const contentText = t('user_details.content');

  const tableHeaders = [
    classificationText,
    reporterText,
    dateText,
    importanceText,
    contentText,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.noticeHeaderContainer}>
        <FastImage
          source={images.tenantWarning}
          resizeMode="contain"
          style={styles.noticeIcon}
        />
        <BaseText>{notesText}</BaseText>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView maximumZoomScale={2}>
          {isNotice ? (
            <TouchableOpacity activeOpacity={1}>
              <InfoTable
                tableHeader={tableHeaders}
                tableData={dummyNoticeTableContent}
                headerWidthArr={[115, 115, 164, 60, 410]}
                bodyWidthArr={[115, 115, 164, 60, 410]}
              />
            </TouchableOpacity>
          ) : (
            <BaseText>{notRegisterNotesText}</BaseText>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default UserDetailsNoticeTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
  },
  noticeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noticeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
});
