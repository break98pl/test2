import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import CircleRecordIcon from '@atoms/CircleRecordIcon';
import {RecordType} from '@modules/visitPlan/type';

type AtLeastOneRehaContentProps = {
  numberOfCreatedRehaRecords: number;
  numberOfPlannedExercise: number;
  numberOfDoneExercise: number;
  numberOfCancelExercise: number;
  isUnsync: boolean;
  isDisable: boolean;
};

const AtLeastOneRehaContent = ({
  numberOfCreatedRehaRecords,
  numberOfPlannedExercise,
  numberOfDoneExercise,
  numberOfCancelExercise,
  isUnsync,
  isDisable,
}: AtLeastOneRehaContentProps) => {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.flatten([styles.leftSection, styles.center])}>
        <BaseText
          style={StyleSheet.flatten([
            styles.recordText,
            styles.createdRecordText,
          ])}>
          {numberOfCreatedRehaRecords.toString()}
        </BaseText>
        <View style={styles.slantedLine} />
        <BaseText
          style={StyleSheet.flatten([
            styles.recordText,
            styles.plannedRecordText,
          ])}>
          {numberOfPlannedExercise.toString()}
        </BaseText>
      </View>
      <View style={StyleSheet.flatten([styles.midSection, styles.center])}>
        <BaseText style={styles.recordText}>
          {numberOfDoneExercise.toString()}
        </BaseText>
        {isUnsync && !isDisable && (
          <View style={styles.recordIconContainer}>
            <CircleRecordIcon
              size="medium"
              recordType={RecordType.Reha}
              isUnsync={true}
            />
          </View>
        )}
      </View>
      <View style={StyleSheet.flatten([styles.rightSection, styles.center])}>
        <BaseText style={styles.recordText}>
          {numberOfCancelExercise.toString()}
        </BaseText>
      </View>
    </View>
  );
};

export default AtLeastOneRehaContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSection: {
    flex: 0.333,
    borderRightWidth: 1,
    borderRightColor: Colors.GRAY_PH,
  },
  midSection: {
    flex: 0.333,
    borderRightWidth: 1,
    borderRightColor: Colors.GRAY_PH,
    height: '65%',
  },
  rightSection: {
    flex: 0.333,
  },
  recordText: {
    fontWeight: FontWeight.BOLD,
    fontSize: FontSize.XX_LARGE,
  },
  createdRecordText: {
    paddingRight: 20,
  },
  plannedRecordText: {
    paddingLeft: 20,
  },
  slantedLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.BLACK,
    transform: [{rotate: '-50deg'}],
  },
  recordIconContainer: {
    position: 'absolute',
    width: 18,
    height: 18,
    bottom: -6,
    left: 4,
  },
});
