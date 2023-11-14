import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import BaseText from '@atoms/BaseText';
import {
  RehaRecord,
  RehaExercise,
  RehaExerciseStatus,
} from '@modules/record/record.type';
import moment from 'moment';
import {TIME_24H_FORMAT} from '@constants/constants';
import useHighlightMemo from '@hooks/useHighlightMemo';

type Props = {
  rehaRecord: RehaRecord;
};

const CareListRehaContent = ({rehaRecord}: Props) => {
  const {t} = useTranslation();
  const {highlightMemo} = useHighlightMemo();

  const memoText = t('care_list.memoWithBracket');
  const contentText = t('care_list.content');
  const chargeInfoText = t('care_list.chargeInfo');
  const cancelText = t('care_list.cancel');
  const rehaSettingText = t('care_list.rehaSetting');
  const rehaStartAndEndText = t('care_list.rehaStartAndEnd');
  const rehaExerciseDescriptionText = t('care_list.rehaExerciseDescription');
  const rehaStateOfDoneText = t('care_list.rehaStateOfDone');

  const getRehaContent = () => {
    return rehaRecord.exercises.map((exercise: RehaExercise) => {
      switch (exercise.status) {
        case RehaExerciseStatus.Cancelled:
          return (
            <Fragment key={exercise.id}>
              <View style={styles.line} />
              <BaseText>
                {contentText}
                {exercise.registeredInfo.name ?? ''}
              </BaseText>
              <BaseText>
                {cancelText}
                {exercise.cancellationReason ?? ''}
              </BaseText>
              <BaseText>
                {memoText}
                {exercise.note ?? ''}
              </BaseText>
            </Fragment>
          );
        case RehaExerciseStatus.Finished:
          return (
            <Fragment key={exercise.id}>
              <View style={styles.line} />
              <BaseText>
                {contentText}
                {exercise.registeredInfo.name}
              </BaseText>
              <BaseText>
                {rehaSettingText}
                {/*TODO: get unit setting from local db*/}
                {`${exercise.result?.amount ?? ''}回 ${
                  exercise.result?.set ?? ''
                }セット`}
              </BaseText>
              <BaseText>
                {rehaStartAndEndText}
                {exercise.startTime && exercise.endTime
                  ? `${moment(exercise.startTime).format(
                      TIME_24H_FORMAT,
                    )} 〜 ${moment(exercise.endTime).format(TIME_24H_FORMAT)}`
                  : ''}
              </BaseText>
              <BaseText>
                {rehaExerciseDescriptionText}
                {exercise.result?.borgScale ?? ''}
              </BaseText>
              <BaseText>
                {rehaStateOfDoneText}
                {exercise.result?.achievementLevel ?? ''}
              </BaseText>
              <BaseText>
                {memoText}
                {highlightMemo(exercise.note ?? '')}
              </BaseText>
            </Fragment>
          );
        default:
          return <></>;
      }
    });
  };

  return (
    <View>
      {/* charge info will always be shown */}
      <BaseText>
        {chargeInfoText}
        {rehaRecord.paymentType.split('.').at(1) ?? ''}
      </BaseText>
      {getRehaContent()}
    </View>
  );
};

export default CareListRehaContent;

const styles = StyleSheet.create({
  line: {
    borderTopWidth: 1,
    marginVertical: 8,
  },
});
