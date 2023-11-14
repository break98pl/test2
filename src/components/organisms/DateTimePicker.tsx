import {ColorValue, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import DatePicker from 'react-native-date-picker';
import BaseText from '@atoms/BaseText';
import DateTimePickerText, {
  DateTimePickerMode,
} from '@molecules/DateTimePickerText';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight, Weight} from '@themes/typography';
import useVisible from '@hooks/useVisible';
import RecordContentItem from '@molecules/RecordContentItem';

interface DateTimePickerProps {
  /**
   * picker mode
   */
  mode?: DateTimePickerMode;
  /**
   * date is chosen from datetime tooltip
   */
  defaultDate?: Date;
  /**
   * date text color
   */
  dateTextColor?: ColorValue;
  /**
   * is show suffix after text string
   */
  isShowSuffix?: boolean;
  /**
   * tooltip title
   */
  title?: string;
  /**
   * header is at the bottom
   */
  isReversedHeader?: boolean;
  /**
   * allow feature date selection
   */
  isAllowFuture?: boolean;
  /**
   * is show arrow down before date text
   */
  isShowArrowDown?: boolean;
  /**
   * only available in normal header mode
   */
  isShowOk?: boolean;
  /**
   * header container only the back button (usually use in combined with isShowOk = true and do not use with reversed header)
   */
  isSimpleHeader?: boolean;
  /**
   * is allow text to change color base on past, current or feature date
   */
  isAllowChangeColor?: boolean;

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minDate?: Date;

  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maxDate?: Date;

  weightDateTxt?: Weight;

  /**
   * Change date value when choose date
   * @param date
   * @returns
   */
  onConfirmDate?: (date: Date) => void;

  /**
   * Disabled to prevent press to date
   */
  disabled?: boolean;

  /**
   * Hide year
   */
  hideYear?: boolean;

  /**
   * none of value
   */
  isNullDate?: boolean;

  /**
   * allow change default date
   */
  allowChangeDefaultDate?: boolean;

  isFullWidth?: boolean;
}

const DateTimePicker = ({
  mode = DateTimePickerMode.DateTime,
  title = '',
  defaultDate = new Date(),
  isShowSuffix,
  isReversedHeader = false,
  isShowArrowDown = true,
  isShowOk = false,
  isSimpleHeader,
  isAllowChangeColor = true,
  dateTextColor = Colors.DARK_BLUE,
  weightDateTxt,
  onConfirmDate,
  minDate,
  maxDate,
  disabled,
  hideYear,
  isNullDate,
  allowChangeDefaultDate = false,
  isFullWidth = false,
}: DateTimePickerProps) => {
  const {t} = useTranslation();
  const [tempDate, setTempDate] = useState(defaultDate);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const {
    isVisible: isShowTooltip,
    showComponent: showTooltip,
    hideComponent: hideTooltip,
  } = useVisible();
  useEffect(() => {
    if (allowChangeDefaultDate) {
      setSelectedDate(defaultDate);
      setTempDate(defaultDate);
    }
  }, [defaultDate]);

  useEffect(() => {
    setTempDate(selectedDate);
  }, [isShowTooltip]);

  const handleSelectDate = () => {
    hideTooltip();
    setSelectedDate(tempDate);

    if (onConfirmDate) {
      onConfirmDate(tempDate);
    }
  };

  /**
   * Called when user press "Today" button on tooltip header.
   */
  const resetToCurrentDate = () => {
    setTempDate(new Date());
  };

  /**
   * Render Tooltip header.
   */
  const renderCustomDateTimeTooltipHeader = () => {
    return (
      <>
        <View
          style={
            !isReversedHeader
              ? styles.header
              : StyleSheet.flatten([styles.header, styles.reversedHeader])
          }>
          <View
            style={
              !isSimpleHeader
                ? styles.leftSection
                : StyleSheet.flatten([
                    styles.leftSection,
                    {
                      position: 'absolute',
                      left: 6,
                      zIndex: 10,
                    },
                  ])
            }>
            <BaseButton
              onPress={hideTooltip}
              textStyle={styles.buttonText}
              text={t('common.close')}
            />
          </View>
          <View style={isSimpleHeader ? styles.simpleHeader : {}}>
            <BaseText style={styles.title}>{title}</BaseText>
          </View>
          {!isSimpleHeader && (
            <View style={styles.rightSection}>
              <BaseButton
                onPress={resetToCurrentDate}
                textStyle={styles.buttonText}
                text={t('common.today')}
              />
              <BaseButton
                onPress={handleSelectDate}
                textStyle={styles.buttonText}
                text={t('common.select')}
              />
            </View>
          )}
        </View>
      </>
    );
  };
  const renderFullWidthDatePickerStyle = () => {
    return (
      <RecordContentItem disable title={title}>
        <BaseTooltip
          placement={'bottom'}
          isVisible={isShowTooltip}
          showChildInTooltip={false}
          closeOnBackgroundInteraction={false}
          contentStyle={isShowOk ? styles.toolTipContent : {}}
          content={
            <View
              style={!isReversedHeader ? undefined : styles.reversedContainer}>
              {renderCustomDateTimeTooltipHeader()}
              <DatePicker
                style={styles.datePicker}
                date={tempDate}
                onDateChange={setTempDate}
                mode={mode}
                locale="ja"
                minimumDate={minDate}
                maximumDate={maxDate}
              />
              {!isReversedHeader && isShowOk && (
                <View style={styles.okSection}>
                  <BaseButton onPress={handleSelectDate}>
                    <BaseText style={styles.ok}>
                      {t('common.ok').toUpperCase()}
                    </BaseText>
                  </BaseButton>
                </View>
              )}
            </View>
          }>
          <View style={styles.targetShowTooltip} />
        </BaseTooltip>
        <View style={styles.valueView}>
          {!isNullDate ? (
            <DateTimePickerText
              disabled={disabled}
              mode={mode}
              isShowSuffix={isShowSuffix}
              isShowArrowDown={isShowArrowDown}
              onPress={!disabled ? showTooltip : hideTooltip}
              color={dateTextColor}
              date={selectedDate}
              isAllowChangeColor={isAllowChangeColor}
              weightDateText={weightDateTxt}
              hideYear={hideYear}
            />
          ) : (
            <BaseText
              onPress={!disabled ? showTooltip : hideTooltip}
              style={styles.emptyDate}
            />
          )}
        </View>
      </RecordContentItem>
    );
  };
  const renderNormalDatePickerStyle = () => {
    return (
      <BaseTooltip
        placement={'bottom'}
        isVisible={isShowTooltip}
        showChildInTooltip={false}
        closeOnBackgroundInteraction={false}
        contentStyle={isShowOk ? styles.toolTipContent : {}}
        content={
          <View
            style={!isReversedHeader ? undefined : styles.reversedContainer}>
            {renderCustomDateTimeTooltipHeader()}
            <DatePicker
              style={styles.datePicker}
              date={tempDate}
              onDateChange={setTempDate}
              mode={mode}
              locale="ja"
              minimumDate={minDate}
              maximumDate={maxDate}
            />
            {!isReversedHeader && isShowOk && (
              <View style={styles.okSection}>
                <BaseButton onPress={handleSelectDate}>
                  <BaseText style={styles.ok}>
                    {t('common.ok').toUpperCase()}
                  </BaseText>
                </BaseButton>
              </View>
            )}
          </View>
        }>
        {!isNullDate ? (
          <DateTimePickerText
            disabled={disabled}
            mode={mode}
            isShowSuffix={isShowSuffix}
            isShowArrowDown={isShowArrowDown}
            onPress={!disabled ? showTooltip : hideTooltip}
            color={dateTextColor}
            date={selectedDate}
            isAllowChangeColor={isAllowChangeColor}
            weightDateText={weightDateTxt}
            hideYear={hideYear}
          />
        ) : (
          <BaseText
            onPress={!disabled ? showTooltip : hideTooltip}
            style={styles.emptyDate}
          />
        )}
      </BaseTooltip>
    );
  };
  return isFullWidth
    ? renderFullWidthDatePickerStyle()
    : renderNormalDatePickerStyle();
};

export default React.memo(DateTimePicker);

const styles = StyleSheet.create({
  reversedContainer: {
    flexDirection: 'column-reverse',
  },
  toolTipContent: {
    height: 300,
  },
  datePicker: {
    width: 380,
  },
  header: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.TABLE_BORDER_GRAY,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  reversedHeader: {
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.TABLE_BORDER_GRAY,
  },
  simpleHeader: {
    flex: 1,
    alignItems: 'center',
  },
  leftSection: {
    flex: 0.4,
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    flex: 0.4,
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: FontWeight.BOLD,
    fontSize: FontSize.X_LARGE,
  },
  buttonText: {
    color: Colors.TEXT_LINK_BLUE,
    fontSize: FontSize.X_LARGE,
  },
  okSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ok: {
    color: Colors.TEXT_LINK_BLUE,
    fontWeight: FontWeight.BOLD,
    fontSize: FontSize.XX_LARGE,
  },
  emptyDate: {
    width: 80,
    height: 20,
  },
  targetShowTooltip: {
    width: 120,
    height: 20,
  },
  valueView: {
    marginLeft: -120,
    width: '100%',
  },
});
