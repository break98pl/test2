import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RecordContentItem from './RecordContentItem';
import BaseTooltip from '@templates/BaseTooltip';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import TooltipListData from '@organisms/TooltipListData';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import useVisible from '@hooks/useVisible';
import {useAppSelector} from '@store/config';
import {selectIsShowedSaveButton} from '@modules/setting/setting.slice';
import _ from 'lodash';
import {FontSize, FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
interface templateValue {
  rawData: TextListItem[];
  handleData: string;
}
interface ICapacityInputRecordProps {
  label: string;
  title: string;
  value: string;
  data: TextListItem[];
  onChange: (e: string) => void;
  placeholder?: string;
  disable?: boolean;
  showClearIcon?: boolean;
  showInfoIcon?: boolean;
  notAnySelectedItem?: boolean;
  postponePerform?: boolean;
  onChangelistSelectedValue?: (e: templateValue) => void;
  values?: TextListItem[];
  isMultipleChoice?: boolean;
  isUseCustomStyle?: boolean;
}
const CapacityInputRecord = (props: ICapacityInputRecordProps) => {
  const {
    label,
    title,
    data = [],
    value,
    onChange,
    placeholder,
    disable,
    showInfoIcon,
    showClearIcon,
    notAnySelectedItem,
    postponePerform,
    isMultipleChoice = false,
    onChangelistSelectedValue,
    values = [],
    isUseCustomStyle = false,
  } = props;

  const clearData = () => {
    onChange('');
  };

  const {t} = useTranslation();
  const {
    isVisible: isShowListItemTooltip,
    showComponent: openListItemTooltip,
    hideComponent: hideListItemTooltip,
  } = useVisible();
  const isShowedSaveButton = useAppSelector(selectIsShowedSaveButton);

  const [templateQueue, setTemplateQueue] = useState<TextListItem[]>([]);
  useEffect(() => {
    setTemplateQueue(values);
  }, [value]);
  const handleAddTemplateToQueue = (template: TextListItem) => {
    if (!isMultipleChoice && isShowedSaveButton) {
      setTemplateQueue([template]);
    } else {
      setTemplateQueue(state => {
        const index = _.findIndex(state, e => e.label === template.label);
        if (index !== -1) {
          return [...state];
        }
        return [...state, template];
      });
    }
  };

  const handleRemoveTemplateFromQueue = (template: TextListItem) => {
    if (!isMultipleChoice && isShowedSaveButton) {
      return;
    }
    setTemplateQueue(state => {
      return _.filter(state, e => e.label !== template.label);
    });
  };

  const cancelRecordConfirm = () => {
    setTemplateQueue(values);
    hideListItemTooltip();
  };

  const getLabelFromTemplateQueue = () => {
    let _label = '';
    templateQueue
      .map(template => template.label)
      .forEach(e => {
        _label += `${e.toString()}\t`;
      });
    return _label.trimStart();
  };

  const handleSaveRecordData = () => {
    onChange(getLabelFromTemplateQueue());
    if (isMultipleChoice) {
      onChangelistSelectedValue &&
        onChangelistSelectedValue({
          rawData: [...templateQueue],
          handleData: getLabelFromTemplateQueue(),
        });
      setTemplateQueue([]);
    }
    hideListItemTooltip();
  };

  const checkDisabledSaveButton = () => {
    const isInArray1 = values.every(item =>
      templateQueue.find(item2 => item === item2),
    );
    const isInArray2 = templateQueue.every(item =>
      values.find(item2 => item === item2),
    );
    const isSameArray =
      values.length === templateQueue.length && isInArray1 && isInArray2;
    return isSameArray;
  };

  const getReplaceText = () => {
    if (notAnySelectedItem) {
      return t('popover.not_any_select');
    } else if (postponePerform) {
      return t('popover.can_not_edit');
    } else if (value) {
      return value;
    }
    return placeholder || t('popover.tap_to_select');
  };

  const renderMainDishTooltip = () => {
    return (
      <TooltipListData noDataText={label} existData={!!data.length}>
        <SelectionList
          data={data}
          onSelectItem={e => {
            if (!isMultipleChoice) {
              onChange(e.label);
              hideListItemTooltip();
            }
          }}
          valueChosen={value}
          allowChangeBgChosen
          showCheckIcon={isMultipleChoice}
          onAdd={handleAddTemplateToQueue}
          onRemove={handleRemoveTemplateFromQueue}
          isMultipleChoice={isMultipleChoice}
          queue={templateQueue}
        />
      </TooltipListData>
    );
  };

  return (
    <RecordContentItem
      disable={disable}
      isChoosing={isShowListItemTooltip}
      onPress={openListItemTooltip}
      title={label}
      titleStyle={isUseCustomStyle ? styles.customTitleStyle : {}}>
      <View
        style={[
          styles.frameHasIconClear,
          isUseCustomStyle ? styles.titleStyle : {},
        ]}>
        <View style={styles.leftFrameView}>
          <BaseTooltip
            title={title}
            showHeader
            placement={'right'}
            isVisible={isShowListItemTooltip}
            onClose={hideListItemTooltip}
            closeOnContentInteraction={false}
            closeOnBackgroundInteraction={false}
            leftButtonText={t('user_list.close')}
            rightButtonText={
              isMultipleChoice || isShowedSaveButton ? t('common.select') : ''
            }
            disabledRightButton={checkDisabledSaveButton()}
            onRightButtonPress={handleSaveRecordData}
            onLeftButtonPress={cancelRecordConfirm}
            content={renderMainDishTooltip()}
            contentStyle={styles.tooltipContainer}
            headerStyle={styles.headerSettingPeriod}>
            <View style={styles.targetShowTooltip} />
          </BaseTooltip>
          <BaseText
            color={isShowListItemTooltip ? Colors.WHITE : Colors.TEXT_PRIMARY}
            text={getReplaceText()}
            style={[
              styles.valueView,
              styles.baseText,
              isUseCustomStyle ? styles.customContentStyle : {},
              value.length > 23 ? {fontSize: FontSize.SMALL} : {},
            ]}
            numberOfLines={1}
            opacity={!value.length || postponePerform ? 'low' : 'normal'}
          />
        </View>
        {showClearIcon && (
          <BaseButton onPress={clearData}>
            <FastImage
              style={styles.multiplyIcon}
              resizeMode="contain"
              source={images.multiplyIcon}
            />
          </BaseButton>
        )}
        {showInfoIcon && (
          <FastImage
            style={styles.infoIcon}
            resizeMode="contain"
            source={images.infoIcon}
          />
        )}
      </View>
    </RecordContentItem>
  );
};

export default CapacityInputRecord;

const styles = StyleSheet.create({
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  tooltipContainer: {
    width: 345,
    height: 700,
  },
  multiplyIcon: {
    width: 24,
    height: 24,
  },
  frameHasIconClear: {
    flexDirection: 'row',
    width: 400,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftFrameView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  targetShowTooltip: {
    width: 80,
    height: 20,
  },
  valueView: {
    marginLeft: -100,
  },
  infoIcon: {
    width: 18,
    height: 18,
  },
  customTitleStyle: {
    fontWeight: FontWeight.NORMAL,
    fontSize: FontSize.X_LARGE,
    color: Colors.TEXT_PRIMARY,
    marginLeft: -20, //equal gap of leftFrameView
  },
  customContentStyle: {
    fontWeight: FontWeight.NORMAL,
    fontSize: FontSize.LARGE,
    color: Colors.PRIMARY,
    opacity: 1,
  },
  baseText: {
    width: '90%',
  },
  titleStyle: {
    width: 130,
  },
});
