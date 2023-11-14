import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import SlideTabsTooltip, {TabComponentProps} from '@templates/SlideTabsTooltip';
import PopoverCalculator from '@organisms/PopoverCalculator';
import TooltipListData from '@organisms/TooltipListData';
import RecordContentItem from './RecordContentItem';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {SceneRendererProps} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';

interface IVolumeInputRecordProps {
  label: string;
  title: string;
  value: string;
  initialValue?: string;
  data: TextListItem[];
  keyTabs: string[];
  onChange: (e: string) => void;
}

const VolumeInputRecord = (props: IVolumeInputRecordProps) => {
  const {
    label,
    title,
    value,
    initialValue = value,
    data,
    keyTabs,
    onChange,
  } = props;
  const {t} = useTranslation();
  const [isShowVolumeTooltip, setIsShowVolumeTooltip] = useState(false);
  const [isOpenVolumeCalculator, setIsOpenVolumeCalculator] = useState(false);
  const flatListRef = useRef<FlatList<TextListItem> | null>(null);

  const openWaterVolumeTooltip = () => {
    setIsShowVolumeTooltip(true);
    setIsOpenVolumeCalculator(false);
  };

  const hideWaterVolumeTooltip = () => {
    setIsShowVolumeTooltip(false);
  };

  const handleLeftButtonWaterVolumeTooltip = () => {
    if (isOpenVolumeCalculator) {
      setIsOpenVolumeCalculator(false);
    } else {
      hideWaterVolumeTooltip();
    }
  };

  const handleBackToAvailableWaterVolume = ({jumpTo}: SceneRendererProps) => {
    setIsOpenVolumeCalculator(false);
    jumpTo(keyTabs[0]);
  };

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current && !!value && isShowVolumeTooltip) {
        const index = _.findIndex(data, e => e.label === value);
        flatListRef.current.scrollToOffset({offset: index * 46});
      }
    }, 500);
  }, [isShowVolumeTooltip]);

  const renderWaterVolumeTooltip = ({jumpTo}: TabComponentProps) => {
    return (
      <TooltipListData noDataText={label} existData={!!data.length}>
        <SelectionList
          ref={flatListRef}
          data={data}
          onSelectItem={e => {
            if (e.label === '直接入力') {
              setIsOpenVolumeCalculator(true);
              jumpTo(keyTabs[1]);
            } else {
              onChange && onChange(e.label);
              hideWaterVolumeTooltip();
            }
          }}
          valueChosen={value}
          allowChangeBgChosen
        />
      </TooltipListData>
    );
  };

  const renderWaterVolumeCalculatorTooltip = () => {
    return (
      <PopoverCalculator
        onChange={e => onChange(e)}
        onClose={() => {
          hideWaterVolumeTooltip();
        }}
        initialValue={initialValue}
      />
    );
  };

  const renderSceneWater = (propers: TabComponentProps) => {
    switch (propers.route.key) {
      case keyTabs[0]:
        return renderWaterVolumeTooltip(propers);
      case keyTabs[1]:
        return renderWaterVolumeCalculatorTooltip();
    }
  };

  return (
    <RecordContentItem
      isChoosing={isShowVolumeTooltip}
      onPress={openWaterVolumeTooltip}
      title={label}>
      <View style={styles.inputShowFrame}>
        <SlideTabsTooltip
          renderScene={renderSceneWater}
          showBackIcon
          backText={title}
          title={`${title}${
            isOpenVolumeCalculator ? t('popover.typing_volume') : ''
          }`}
          showHeader
          placement={'right'}
          isVisible={isShowVolumeTooltip}
          onClose={hideWaterVolumeTooltip}
          closeOnContentInteraction={false}
          closeOnBackgroundInteraction={false}
          onLeftButtonPress={handleLeftButtonWaterVolumeTooltip}
          tabComponents={[
            {
              key: keyTabs[0],
              component: renderWaterVolumeTooltip,
            },
            {
              key: keyTabs[1],
              component: renderWaterVolumeCalculatorTooltip,
            },
          ]}
          contentStyle={
            isOpenVolumeCalculator
              ? styles.calculatorContainer
              : styles.tooltipContainer
          }
          onBack={proper => handleBackToAvailableWaterVolume(proper)}
          headerStyle={styles.headerSettingPeriod}>
          <View style={styles.targetShowTooltip} />
        </SlideTabsTooltip>
        <View style={styles.waterView}>
          <BaseText
            color={isShowVolumeTooltip ? Colors.WHITE : Colors.TEXT_PRIMARY}
            text={t('popover.ml')}
          />
          <BaseText
            color={isShowVolumeTooltip ? Colors.WHITE : Colors.TEXT_PRIMARY}
            text={value}
          />
        </View>
      </View>
    </RecordContentItem>
  );
};

export default VolumeInputRecord;

const styles = StyleSheet.create({
  tooltipContainer: {
    width: 345,
    height: 700,
  },
  calculatorContainer: {
    width: 345,
    height: 570,
  },
  inputShowFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  targetShowTooltip: {
    width: 80,
    height: 20,
  },
  waterView: {
    width: 70,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginRight: -100,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
});
