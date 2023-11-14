import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import RecordContentItem from '@molecules/RecordContentItem';
import BaseTextInput from '@molecules/BaseTextInput';
import {useTranslation} from 'react-i18next';
import AttendanceContentItem from '@molecules/AttendanceContentItem';
import _ from 'lodash';
import {RegisterState} from '@modules/visitPlan/type';
import {
  getNoteFromStatus,
  getStateText,
} from '@modules/visitPlan/tsushoVPList.utils';
export type TAttendanceRecordData = {
  status: string;
  state: string;
  memo: string;
  letter: string;
};

export type TAttendanceRecordDataChange = {
  status?: string;
  state?: string;
  memo?: string;
  letter?: string;
};

type TAttendanceType = {
  id: string;
  label: string;
  color: string;
};

const AttendanceTypeList: TAttendanceType[] = [
  {
    id: RegisterState.Start,
    label: 'popover.attendance_providing_service',
    color: Colors.TEXT_SECONDARY,
  },
  {
    id: RegisterState.GoHome,
    label: 'popover.attendance_go_home',
    color: Colors.TEXT_SECONDARY,
  },
  {
    id: RegisterState.Leave,
    label: 'popover.attendance_postpone',
    color: Colors.DEEP_PINK_COLOR,
  },
  {
    id: RegisterState.Cancel,
    label: 'popover.attendance_cancel',
    color: Colors.DEEP_PINK_COLOR,
  },
  {
    id: RegisterState.Absent,
    label: 'popover.attendance_absent',
    color: Colors.DEEP_PINK_COLOR,
  },
];

interface IAttendanceRecordContentProps {
  data: TAttendanceRecordData;
  onChange: (e: TAttendanceRecordDataChange) => void;
  isHaveResult?: boolean;
}

const AttendanceRecordContent = (props: IAttendanceRecordContentProps) => {
  const {data, onChange, isHaveResult} = props;
  const {t} = useTranslation();
  const [pressedHistories, setPressedHistories] = useState<string[]>([]);
  const [noteList, setNoteList] = useState<string[]>([]);

  useEffect(() => {
    setNoteList(getNoteFromStatus(data.status, isHaveResult));
  }, []);

  const addSelectedItemToHistories = (value: string) => {
    setPressedHistories(state => {
      if (!_.includes(state, value)) {
        state.push(value);
        return state;
      }
      return state;
    });
  };

  return (
    <View style={styles.container}>
      <BaseText
        style={styles.statusText}
        color={Colors.GRAY_TEXT}
        size="small"
        text={`${t('popover.attendance_status')}: ${
          t(getStateText(data.status)) || '---'
        }`}
      />

      {AttendanceTypeList.map((e, index) => {
        return (
          <AttendanceContentItem
            key={e.id}
            label={t(e.label)}
            content={noteList[index]}
            checked={data.state === t(e.label)}
            onPress={() => {
              onChange({state: t(e.label)});
              addSelectedItemToHistories(e.id);
            }}
            textColor={
              !isHaveResult && e.id === RegisterState.Absent
                ? Colors.TEXT_SECONDARY
                : e.color
            }
            selectedInPast={_.includes(pressedHistories, e.id)}
            disabled={noteList[index] ? noteList[index].length > 0 : false}
          />
        );
      })}

      <RecordContentItem
        style={styles.memoFrame}
        disable
        title={t('popover.memo')}>
        <BaseTextInput
          onChangeText={e => onChange({memo: e})}
          value={data.memo}
          multiline
          maxLength={30}
          containerStyle={styles.memoLabelViewStyle}
          style={styles.memoInputStyle}
          placeholder={
            !data.state ? t('popover.select_attendance_to_edit') : ''
          }
          editable={data.state.length > 0}
        />
      </RecordContentItem>

      <RecordContentItem
        titleStyle={styles.letterLabel}
        leftViewStyle={styles.contentLeftLetterLabelView}
        disable
        title={t('popover.attendance_letter')}>
        <BaseTextInput
          onChangeText={e => onChange({letter: e})}
          value={data.letter}
          multiline
          containerStyle={styles.letterLabelViewStyle}
          style={styles.letterInputStyle}
        />
      </RecordContentItem>
    </View>
  );
};

export default AttendanceRecordContent;

const styles = StyleSheet.create({
  container: {},
  statusText: {
    marginLeft: 10,
    marginBottom: 5,
  },
  memoFrame: {
    marginTop: 15,
  },
  memoLabelViewStyle: {
    height: 30,
    backgroundColor: Colors.WHITE,
    width: 400,
  },
  memoInputStyle: {
    height: 30,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    width: 410,
  },
  letterLabelViewStyle: {
    height: 125,
    backgroundColor: Colors.WHITE,
    width: 400,
  },
  letterInputStyle: {
    height: 125,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
  },
  contentLeftLetterLabelView: {
    height: '100%',
    width: 110,
  },
  letterLabel: {
    marginTop: 20,
  },
});
