import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import RecordContentItem from '@molecules/RecordContentItem';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import BaseTextInput from '@molecules/BaseTextInput';
import BaseTooltip from '@templates/BaseTooltip';
import TooltipListData from './TooltipListData';
import ClassificationTemplateItem from '@molecules/ClassificationTemplateItem';
import SelectionList, {TextListItem} from './SelectionList';
import ClassificationTemplateSelectionList, {
  IElapsedTemplateListItem,
} from './ClassificationTemplateSelectionList';
import _ from 'lodash';
import TypingInputRecord from '@molecules/TypingInputRecord';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {selectIsShowedSaveButton} from '@modules/setting/setting.slice';
import {AppType} from '@modules/setting/setting.type';
import {handleAlertCancel} from '@modules/alerts/alert.ultils';
import {
  TElapsedRecordData,
  TElapsedRecordDataChange,
} from '@modules/elapsed/elapsed.type';
import DateTimePickerInputRecord from '@molecules/DateTimePickerInputRecord';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '@store/config';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {
  DATE_TIME_FORMAT,
  TIME_24H_FORMAT,
  serviceTypeListOne,
  serviceTypeListTwo,
} from '@constants/constants';
import {
  selectRecordSetting,
  setClassificationTemplateList,
  setPlaceTemplateList,
} from '@modules/record/record.slice';
import {convertSettingsSelectItemToTextListItem} from '@modules/record/record.utils';
import {RecordDB} from '@modules/record/record.db';

interface IElapsedRecordTemplateProps {
  data: TElapsedRecordData;
  onChange: (e: TElapsedRecordDataChange) => void;
  isMultipleChoice?: boolean;
  onChangeTab?: (index: number) => void;
  onClose?: () => void;
  onSave?: (isAlertConfirm?: boolean) => void;
  notAllowEditDate?: boolean;
}

const ElapsedRecordTemplate = (props: IElapsedRecordTemplateProps) => {
  const {
    data,
    onChange,
    isMultipleChoice,
    onChangeTab,
    onSave,
    notAllowEditDate,
  } = props;
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [isShowClassificationTooltip, setIsShowClassificationTooltip] =
    useState(false);
  const isShowedSaveButton = useAppSelector(selectIsShowedSaveButton);
  const [templateQueue, setTemplateQueue] = useState<
    IElapsedTemplateListItem[]
  >([]);
  const [classificationChildTemplateList, setClassificationChildTemplateList] =
    useState<IElapsedTemplateListItem[]>([]);
  const appType = useAppSelector(selectAppType);
  const filteringDate = useAppSelector(selectFilteringDate);
  const serviceName = useAppSelector(selectChoseServiceName);
  const recordSetting = useAppSelector(selectRecordSetting);
  const minDate = notAllowEditDate
    ? moment(filteringDate + '00:00', DATE_TIME_FORMAT).toDate()
    : undefined;
  const maxDate = notAllowEditDate
    ? moment(
        filteringDate + moment().format(TIME_24H_FORMAT),
        DATE_TIME_FORMAT,
      ).toDate()
    : undefined;

  const handleRemoveTemplateFromQueue = (
    template: IElapsedTemplateListItem,
  ) => {
    if (!isMultipleChoice && isShowedSaveButton) {
      return;
    }
    setTemplateQueue(state => {
      return _.filter(state, e => e.id !== template.id);
    });
  };

  const handleSave = (isAlertConfirm: boolean) => {
    onSave && onSave(isAlertConfirm);
  };

  const selectAndOpenClassificationTooltip = async (item: TextListItem) => {
    onChange({classification: item.label});
    setIsShowClassificationTooltip(true);
    const classificationTemplateQuery =
      await RecordDB.findClassificationChildTemplateRecords(+item.id);
    setClassificationChildTemplateList(classificationTemplateQuery);
  };

  const hideClassificationTooltip = () => {
    setIsShowClassificationTooltip(false);
  };

  const cancelRecordConfirm = () => {
    if (templateQueue.length > 0) {
      handleAlertCancel(
        () => {
          setIsShowClassificationTooltip(false);
          setTemplateQueue([]);
        },
        () => null,
      );
    } else {
      hideClassificationTooltip();
    }
  };

  const handleAddTemplateToQueue = (template: IElapsedTemplateListItem) => {
    if (!isShowedSaveButton && !isMultipleChoice) {
      onChange({content: template.content});
      handleSave(false);
    } else if (!isMultipleChoice && isShowedSaveButton) {
      setTemplateQueue([template]);
    } else {
      setTemplateQueue(state => {
        const index = _.findIndex(state, e => e.id === template.id);
        if (index !== -1) {
          return [...state];
        }
        return [...state, template];
      });
    }
  };

  const getContentFromTemplateQueue = () => {
    let content = '';
    templateQueue
      .map(template => template.content)
      .forEach(e => {
        content = content + `${e.toString()}\n`;
      });
    return content;
  };

  const handleSaveRecordData = () => {
    onChange({content: getContentFromTemplateQueue()});
    handleSave(true);
  };

  const handlePasteDataToKeyElapse = () => {
    onChange({content: getContentFromTemplateQueue()});
    // Paste template data and navigate to key elapsed
    onChangeTab && onChangeTab(1);
    hideClassificationTooltip();
  };

  const renderClassificationTooltip = () => {
    return (
      <TooltipListData existData={!!classificationChildTemplateList.length}>
        <ClassificationTemplateItem
          isHeader
          textLeft={t('popover.classification_content_template')}
          textRight={t('popover.place')}
        />
        <ClassificationTemplateSelectionList
          data={classificationChildTemplateList}
          isMultipleChoice={isMultipleChoice}
          onSelectItem={onChange}
          onAdd={handleAddTemplateToQueue}
          onRemove={handleRemoveTemplateFromQueue}
          queue={templateQueue}
        />
        {(isMultipleChoice || isShowedSaveButton) && (
          <>
            <View style={styles.templateInputDescription}>
              <BaseText size="small" text={t('common.content')} />
              <BaseText
                size="small"
                color={Colors.HEADER_GRAY}
                text={t('popover.hint_press_long_button')}
              />
            </View>
            <BaseTextInput
              value={getContentFromTemplateQueue()}
              editable={false}
              multiline
              containerStyle={styles.contentViewStyle}
              style={styles.contentInputStyle}
            />
          </>
        )}
      </TooltipListData>
    );
  };

  const getClassificationList = useCallback(async () => {
    try {
      const classificationList =
        await RecordDB.findClassificationTemplateRecords();
      dispatch(setClassificationTemplateList({classificationList}));
    } catch (error) {
      console.error('getClassificationList error', {error});
    }
  }, []);

  const getPlaceList = useCallback(async () => {
    try {
      const placeList = await RecordDB.findPlaceTemplateRecords();
      dispatch(setPlaceTemplateList({placeList}));
    } catch (error) {
      console.error('getPlaceList error', {error});
    }
  }, []);

  useEffect(() => {
    //get classification and place list
    getClassificationList();
    getPlaceList();
  }, []);

  return (
    <View style={styles.container}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        onChange={e => onChange({recordDate: e})}
        minDate={minDate}
        maxDate={maxDate}
      />

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>

      {appType === AppType.TAKINO && (
        <CapacityInputRecord
          label={t('popover.service_type')}
          title={t('popover.service_type')}
          value={data.serviceType}
          data={
            serviceName === t('care_list.smallMultiFunctionsService')
              ? serviceTypeListOne
              : serviceTypeListTwo
          }
          onChange={e => onChange({serviceType: e})}
          placeholder={t('popover.not_set')}
          showInfoIcon
        />
      )}

      <TypingInputRecord
        style={styles.placeItemStyle}
        label={t('popover.place')}
        title={t('popover.place')}
        value={data.placeTemplate}
        data={convertSettingsSelectItemToTextListItem(
          recordSetting.placeTemplateList,
        )}
        onChange={e => onChange({placeTemplate: e})}
        isMultipleChoice={isMultipleChoice}
      />

      <RecordContentItem
        disable
        showLabel={false}
        renderLeftView={
          <View style={styles.classificationLeftView}>
            <BaseTooltip
              showHeader
              isVisible={isShowClassificationTooltip}
              placement="right"
              onClose={hideClassificationTooltip}
              closeOnContentInteraction={false}
              contentStyle={styles.classificationTooltipContainer}
              leftButtonText={t('common.close')}
              onLeftButtonPress={cancelRecordConfirm}
              onRightButtonLongPress={handlePasteDataToKeyElapse}
              onRightButtonPress={handleSaveRecordData}
              rightButtonText={
                isMultipleChoice || isShowedSaveButton ? t('common.save') : ''
              }
              disabledRightButton={!templateQueue.length}
              title={'分類:体調 State'}
              content={renderClassificationTooltip()}>
              <BaseText
                weight="semiBold"
                size="small"
                color={Colors.TEXT_SECONDARY}
                text={t('popover.classification')}
                style={styles.classificationTitle}
              />
            </BaseTooltip>
          </View>
        }>
        <View style={styles.classificationFrame}>
          <BaseText
            color={Colors.HEADER_GRAY}
            text={'次のテンプレートから選択してください'}
          />
          <SelectionList
            style={styles.classificationList}
            data={convertSettingsSelectItemToTextListItem(
              recordSetting.classificationTemplateList,
            )}
            onSelectItem={selectAndOpenClassificationTooltip}
          />
        </View>
      </RecordContentItem>
    </View>
  );
};

export default ElapsedRecordTemplate;

const styles = StyleSheet.create({
  container: {},
  classificationTooltipContainer: {
    width: 485,
    height: '100%',
  },
  placeItemStyle: {
    marginTop: 6,
  },
  classificationLeftView: {
    height: '100%',
    width: 50,
    marginRight: 60,
  },
  classificationTitle: {
    marginTop: 0,
  },
  classificationFrame: {},
  classificationList: {
    marginTop: 5,
    backgroundColor: Colors.WHITE,
    width: 410,
    height: 365,
  },
  templateInputDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    marginVertical: 10,
    gap: 10,
  },
  contentViewStyle: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    height: 230,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  contentInputStyle: {
    height: 210,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
  },
});
