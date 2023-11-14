import React, {memo, useCallback, useEffect, useMemo} from 'react';
import useVisible from '@hooks/useVisible';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RecordContentItem from './RecordContentItem';
import DateTimePicker from '@organisms/DateTimePicker';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import DateTimePickerText, {DateTimePickerMode} from './DateTimePickerText';
import {
  DATABASE_DATETIME_FORMAT,
  VitalPopoverField,
} from '@constants/constants';
import PopoverCalculatorVital from './PopoverCaculatorVital';
import BaseTextInput from './BaseTextInput';
import {getIsBluetoothData, setSelectedId} from '@modules/vital/vital.slice';
import SVGIcon from '@atoms/SVGIcon';
import SlideTabsTooltip from '@templates/SlideTabsTooltip';
import {t} from 'i18next';
import {ItemProps} from '@modules/vital/vital.type';
import {useAppDispatch, useAppSelector} from '@store/config';
import moment from 'moment';
import {convertValueVitalToString} from '@modules/vital/vital.utils';

const ItemPopoverRecordVital = ({
  item,
  value,
  prevValue,
  selectField,
  onChange,
}: {
  item: ItemProps;
  value: any;
  prevValue: any;
  selectField: number;
  onChange: (e: string | Date) => void;
}) => {
  const {
    isVisible: isShowPopover,
    showComponent: showPopover,
    hideComponent: hidePopover,
  } = useVisible();

  const isBluetooth = useAppSelector(getIsBluetoothData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (item.id === selectField) {
      showPopover();
    }

    return () => {
      hidePopover();
    };
  }, [selectField]);

  const openPopover = useCallback(() => {
    dispatch(setSelectedId(item.id));
    showPopover();
  }, []);

  const closePopover = useCallback(() => {
    dispatch(setSelectedId(-1));
    hidePopover();
  }, []);

  /**
   * handle color data when render or inputed data
   */
  const handleColorData = useMemo(() => {
    if (value?.length > 0) {
      if (item.id === VitalPopoverField.REPORTER) {
        return Colors.GRAY_TEXT;
      } else {
        if (item.hint) {
          if (
            parseFloat(value) > parseFloat(item.hint.maxVolume) ||
            parseFloat(value) < parseFloat(item.hint.minVolume)
          ) {
            return Colors.RED;
          } else {
            return Colors.TEXT_PRIMARY;
          }
        }
      }
    }
  }, [value]);

  const handleColorPrevData = useMemo(() => {
    if (item && prevValue && item.hint) {
      if (
        parseFloat(prevValue) > parseFloat(item.hint.maxVolume) ||
        parseFloat(prevValue) < parseFloat(item.hint.minVolume)
      ) {
        return Colors.RED;
      } else {
        return Colors.TEXT_SECONDARY;
      }
    } else {
      return Colors.TEXT_SECONDARY;
    }
  }, [prevValue]);

  const renderWaterVolumeCalculatorTooltip = () => {
    return (
      <PopoverCalculatorVital
        onChange={onChange}
        onClose={hidePopover}
        lastestData={prevValue}
        unit={item.unit}
        hintData={item.hint}
        isWeightField={item.id === VitalPopoverField.WEIGHT}
        initialValue={convertValueVitalToString(value)}
        itemId={item.id}
        lengthDataInput={4}
        showDotKey={
          item.id === VitalPopoverField.BODY_TEMPERATURE ||
          item.id === VitalPopoverField.WEIGHT
        }
      />
    );
  };

  const renderBody = () => {
    switch (item.id) {
      case VitalPopoverField.DATE:
        return (
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <RecordContentItem disable={true} title={item.title}>
                <DateTimePicker
                  mode={DateTimePickerMode.Date}
                  isShowArrowDown={false}
                  isAllowChangeColor={true}
                  onConfirmDate={onChange}
                  defaultDate={
                    value
                      ? moment(value, DATABASE_DATETIME_FORMAT).toDate()
                      : undefined
                  }
                />
              </RecordContentItem>
            </View>

            <View style={styles.containerLastData}>
              <View style={styles.containerDateField}>
                <BaseText
                  style={styles.prevValueText}
                  text={`${t('vital.prev_data')}: `}
                />
                {prevValue ? (
                  <DateTimePickerText
                    date={prevValue}
                    mode={DateTimePickerMode.DateTime}
                    isShowArrowDown={false}
                    isAllowChangeColor={true}
                    color={Colors.BLACK}
                    weightDateText="light"
                    disabled
                  />
                ) : (
                  <></>
                )}
              </View>
            </View>
          </View>
        );
      case VitalPopoverField.REPORTER:
      case VitalPopoverField.REPORT:
        return (
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <RecordContentItem
                disable={true}
                onPress={openPopover}
                title={item.title}>
                <BaseText
                  style={StyleSheet.flatten([
                    {color: handleColorData},
                    styles.textReporter,
                  ])}
                  text={value}
                />
              </RecordContentItem>
            </View>
            {item.id === VitalPopoverField.REPORTER && (
              <View style={styles.columnContainer}>
                <View style={styles.containerLastData}>
                  <View style={styles.containerPrevValueField}>
                    <BaseText
                      style={styles.prevValueText}
                      text={`${t('vital.prev_data')}: `}
                    />
                    <BaseText
                      style={{color: handleColorPrevData}}
                      text={prevValue ? prevValue : '---'}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      case VitalPopoverField.MEMO:
        return (
          <View style={styles.rowContainer}>
            <RecordContentItem disable title={item.title}>
              <BaseTextInput
                multiline
                style={styles.textInput}
                containerStyle={styles.containerTextInput}
                onChangeText={onChange}
                value={value}
              />
            </RecordContentItem>
          </View>
        );
      default:
        return (
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <RecordContentItem onPress={openPopover} title={item.title}>
                <SlideTabsTooltip
                  renderScene={renderWaterVolumeCalculatorTooltip}
                  showBackIcon
                  showHeader
                  placement={'right'}
                  isVisible={isShowPopover}
                  onClose={closePopover}
                  closeOnContentInteraction={false}
                  closeOnBackgroundInteraction={false}
                  onLeftButtonPress={closePopover}
                  tabComponents={[
                    {
                      key: '0',
                      component: renderWaterVolumeCalculatorTooltip,
                    },
                  ]}
                  contentStyle={styles.calculatorContainer}>
                  <View style={styles.textContainer}>
                    {isBluetooth ? (
                      <FlatList
                        style={styles.FlatlistValue}
                        data={value}
                        renderItem={() => (
                          <TouchableOpacity>
                            <SVGIcon name="elipse" width={28} height={28} />
                          </TouchableOpacity>
                        )}
                      />
                    ) : (
                      <BaseText
                        style={{
                          color: handleColorData,
                        }}
                        text={convertValueVitalToString(value)}
                      />
                    )}
                    <View>
                      <BaseText text={item.unit} />
                    </View>
                  </View>
                </SlideTabsTooltip>
              </RecordContentItem>
            </View>

            <View style={styles.columnContainer}>
              <View style={styles.containerLastData}>
                <View style={styles.containerPrevValueField}>
                  <BaseText
                    style={styles.prevValueText}
                    text={`${t('vital.prev_data')}: `}
                  />
                  <BaseText
                    style={{color: handleColorPrevData}}
                    text={
                      prevValue ? convertValueVitalToString(prevValue) : '---'
                    }
                  />
                </View>
                <BaseText style={styles.prevValueText} text={item.unit} />
              </View>

              {item.hint && (
                <View>
                  <BaseText
                    style={styles.textHint}
                    text={`${t('vital.hint')}：`}
                  />
                  <BaseText
                    style={styles.textHint}
                    text={`${item.hint.minVolume}${item.unit}~${item.hint.maxVolume}${item.unit}`}
                  />
                </View>
              )}
            </View>
          </View>
        );
    }
  };

  return <TouchableWithoutFeedback>{renderBody()}</TouchableWithoutFeedback>;
};

export default memo(ItemPopoverRecordVital);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  textContainer: {
    width: 115,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 5,
    fontSize: 13,
    alignItems: 'center',
  },
  textReporter: {
    width: 115,
    fontSize: 15,
    fontWeight: '600',
  },
  textDateFieldCotainer: {
    width: 169,
  },
  prevValueText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 13,
  },
  containerLastData: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    minWidth: 110,
  },
  textHint: {
    fontSize: 13,
    color: Colors.GRAY_TEXT,
  },
  containerTextInput: {
    backgroundColor: Colors.WHITE,
    height: 150,
    width: 400,
  },
  textInput: {height: 150, width: 400},
  columnContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  FlatlistValue: {
    flexDirection: 'row',
    gap: 2,
  },
  calculatorContainer: {
    width: 345,
    height: 570,
  },
  containerDateField: {flexDirection: 'row', alignItems: 'center'},
  containerPrevValueField: {flexDirection: 'row', alignItems: 'center'},
});
