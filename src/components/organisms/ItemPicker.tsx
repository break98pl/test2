import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import RecordContentItem from '@molecules/RecordContentItem';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import BaseTooltip from '@templates/BaseTooltip';
import {Picker} from '@react-native-picker/picker';
import BaseButton from '@atoms/BaseButton';
import {FontSize, FontWeight} from '@themes/typography';
import RehaTargetSection from '@molecules/RehaTargetSection';
import useVisible from '@hooks/useVisible';

const weightList = ['', '0', '1', '2', '3', '4', '5'];
const countList = ['', '0', '1', '2', '3', '4', '5'];
const timeList = ['', '0', '1', '2', '3', '4', '5'];

export type TRehaTarget = {
  weight?: string;
  count?: string;
  times?: string;
};

const initialValue: TRehaTarget = {
  weight: '',
  count: '',
  times: '',
};

interface IItemPickerProps {
  value?: TRehaTarget;
  label?: string;
  title?: string;
  onChange: (e: TRehaTarget) => void;
  notAnySelectedItem?: boolean;
  postponePerform?: boolean;
  disabled?: boolean;
}

const ItemPicker = (props: IItemPickerProps) => {
  const {
    value,
    label,
    title,
    onChange,
    notAnySelectedItem,
    postponePerform,
    disabled,
  } = props;
  const {t} = useTranslation();
  const [selectedValue, setSelectedValue] = useState<TRehaTarget>(initialValue);
  const {
    isVisible: isShowPicker,
    showComponent: openPicker,
    hideComponent: hidePicker,
  } = useVisible();

  const handleChange = useCallback((updatedValue: TRehaTarget) => {
    setSelectedValue(state => ({...state, ...updatedValue}));
  }, []);

  const saveSelectedValue = () => {
    onChange && onChange(selectedValue);
    hidePicker();
  };

  const renderPickerTooltip = () => {
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.selectedSection} />
          <Picker
            selectionColor={Colors.TRANSPARENT}
            selectedValue={selectedValue.weight}
            onValueChange={e => handleChange({weight: e})}
            itemStyle={styles.itemText}
            style={styles.pickerListView}>
            {weightList.map(e => (
              <Picker.Item
                color={Colors.BLACK}
                key={e}
                label={`${e} ${e.length ? t('common.weight') : ''}`}
                value={e}
              />
            ))}
          </Picker>
          <Picker
            selectionColor={Colors.TRANSPARENT}
            selectedValue={selectedValue.count}
            onValueChange={e => handleChange({count: e})}
            itemStyle={styles.itemText}
            style={styles.pickerListView}>
            {countList.map(e => (
              <Picker.Item
                color={Colors.BLACK}
                key={e}
                label={`${e} ${e.length ? t('common.count') : ''}`}
                value={e}
              />
            ))}
          </Picker>
          <Picker
            selectionColor={Colors.TRANSPARENT}
            selectedValue={selectedValue.times}
            onValueChange={e => handleChange({times: e})}
            itemStyle={styles.itemText}
            style={styles.pickerListView}>
            {timeList.map(e => (
              <Picker.Item
                key={e}
                label={`${e} ${e.length ? t('common.time') : ''}`}
                value={e}
              />
            ))}
          </Picker>
        </View>
        <BaseButton onPress={saveSelectedValue} style={styles.okSection}>
          <BaseText style={styles.ok}>{t('common.ok').toUpperCase()}</BaseText>
        </BaseButton>
      </View>
    );
  };

  const getReplaceText = () => {
    if (notAnySelectedItem) {
      return t('popover.not_any_select');
    } else if (postponePerform) {
      return t('popover.can_not_edit');
    }
    return t('popover.tap_to_select');
  };

  return (
    <RecordContentItem
      disable={disabled}
      isChoosing={isShowPicker}
      onPress={openPicker}
      title={label}>
      <BaseTooltip
        title={title}
        showHeader
        placement={'right'}
        isVisible={isShowPicker}
        onClose={hidePicker}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        leftButtonText={t('user_list.close')}
        onLeftButtonPress={hidePicker}
        content={renderPickerTooltip()}
        contentStyle={styles.tooltipContainer}
        headerStyle={styles.headerSettingPeriod}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      {!postponePerform &&
      value &&
      Object.values(value).filter(e => e.length > 0).length > 0 ? (
        <RehaTargetSection
          weight={value?.weight}
          count={value?.count}
          times={value?.times}
        />
      ) : (
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={getReplaceText()}
        />
      )}
    </RecordContentItem>
  );
};

export default ItemPicker;

const styles = StyleSheet.create({
  tooltipContainer: {
    width: 420,
    height: 375,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  targetShowTooltip: {
    width: 1,
    height: 20,
  },
  container: {
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerListView: {
    width: '33%',
  },
  okSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  ok: {
    color: Colors.TEXT_LINK_BLUE,
    fontWeight: FontWeight.BOLD,
    fontSize: FontSize.XX_LARGE,
  },
  itemText: {
    fontSize: FontSize.XX_LARGE,
  },
  selectedSection: {
    height: 40,
    width: 390,
    backgroundColor: Colors.GRAY_BACKGROUND,
    position: 'absolute',
    marginTop: 87,
    marginLeft: 15,
    borderRadius: 12,
  },
});
