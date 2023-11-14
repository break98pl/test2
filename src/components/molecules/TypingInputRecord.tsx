import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import RecordContentItem from './RecordContentItem';
import BaseTooltip from '@templates/BaseTooltip';
import BaseTextInput from './BaseTextInput';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import TooltipListData from '@organisms/TooltipListData';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import useVisible from '@hooks/useVisible';
import {numbericCharacter} from '@constants/constants';

interface ITypingInputRecordProps {
  label: string;
  title: string;
  value: string;
  data: TextListItem[];
  onChange: (e: string) => void;
  isMultipleChoice?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  editable?: boolean;
  maxLength?: number;
  isNumber?: boolean;
  showInfoIcon?: boolean;
}

const TypingInputRecord = (props: ITypingInputRecordProps) => {
  const {
    label,
    title,
    value,
    data = [],
    onChange,
    isMultipleChoice,
    style,
    placeholder,
    editable = true,
    maxLength,
    isNumber = false,
    showInfoIcon = true,
  } = props;
  const {t} = useTranslation();
  const {
    isVisible: isShowListItemTooltip,
    showComponent: openListItemTooltip,
    hideComponent: hideListItemTooltip,
  } = useVisible();

  const renderUrineVolumeTooltip = () => {
    return (
      <TooltipListData noDataText={label} existData={!!data.length}>
        <SelectionList
          data={data}
          onSelectItem={e => {
            onChange(e.label);
            hideListItemTooltip();
          }}
          valueChosen={value}
          allowChangeBgChosen
        />
      </TooltipListData>
    );
  };

  return (
    <RecordContentItem style={style} disable title={label}>
      <View style={styles.placeView}>
        <View style={styles.inputFrameView}>
          <BaseTooltip
            title={title}
            showHeader
            placement={'right'}
            isVisible={isShowListItemTooltip}
            onClose={hideListItemTooltip}
            closeOnContentInteraction={false}
            closeOnBackgroundInteraction={false}
            leftButtonText={t('user_list.close')}
            onLeftButtonPress={hideListItemTooltip}
            content={renderUrineVolumeTooltip()}
            contentStyle={styles.bathMethodContainer}
            headerStyle={styles.headerSettingPeriod}>
            <View style={styles.targetShowTooltip} />
          </BaseTooltip>
          <BaseTextInput
            value={value}
            placeholder={placeholder}
            containerStyle={styles.placeInputStyle}
            onChangeText={e => {
              const numericValue = isNumber
                ? e.replace(numbericCharacter, '')
                : e;
              onChange(numericValue);
            }}
            keyboardType={isNumber ? 'number-pad' : 'default'}
            editable={editable}
            maxLength={maxLength}
          />
          <BaseButton disabled={!editable} onPress={openListItemTooltip}>
            {showInfoIcon && (
              <FastImage
                style={styles.infoIcon}
                resizeMode="contain"
                source={images.infoIcon}
              />
            )}
          </BaseButton>
        </View>
        {isMultipleChoice && (
          <BaseText
            color={Colors.HEADER_GRAY}
            size="small"
            text={t('popover.note_allow_multiple_elapsed')}
          />
        )}
      </View>
    </RecordContentItem>
  );
};

export default TypingInputRecord;

const styles = StyleSheet.create({
  urineFrameInput: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: 400,
  },
  urineInputStyle: {
    backgroundColor: Colors.WHITE,
    width: 360,
    height: 23,
    marginLeft: -100,
  },
  bathMethodContainer: {
    width: 345,
    height: '100%',
  },
  targetShowTooltip: {
    width: 80,
    height: 20,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  infoIcon: {
    width: 18,
    height: 18,
  },
  placeView: {
    rowGap: 3,
    width: 450,
    height: 30,
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
  },
  placeInputStyle: {
    backgroundColor: Colors.WHITE,
    width: 360,
    height: 23,
    paddingHorizontal: 0,
    marginLeft: -100,
  },
  inputFrameView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});
