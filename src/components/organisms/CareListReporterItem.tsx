import {StyleSheet, View} from 'react-native';
import {careListTableColWidths} from '@organisms/CareListTableHeader';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useSelector} from 'react-redux';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';
import {RecordReporter} from '@modules/record/record.type';

interface Props {
  reporter: RecordReporter;
}
const CareListReporterItem = ({reporter}: Props) => {
  const loggedStaff = useSelector(selectSelectedStaff);
  const loggedStaffName = `${loggedStaff?.firstName}${loggedStaff?.lastName}`;

  const getStaffColor = () => {
    if (reporter.name === loggedStaffName) {
      return undefined;
    } else {
      return Colors.GRAY_TEXT;
    }
  };

  return (
    <View style={styles.container}>
      {reporter.jobs.length > 0 && (
        <BaseText color={getStaffColor()}>
          {/* show the highest priority job of reporter on UI */}
          {reporter.jobs[0]}
        </BaseText>
      )}
      <BaseText color={getStaffColor()}>{reporter.name}</BaseText>
    </View>
  );
};

export default CareListReporterItem;

const styles = StyleSheet.create({
  container: {
    width: careListTableColWidths.recordReporter,
    marginTop: 5,
    paddingLeft: 6,
  },
});
