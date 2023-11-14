import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RecordContentItem from './RecordContentItem';
import BaseTooltip from '@templates/BaseTooltip';
import BaseText from '@atoms/BaseText';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import moment from 'moment';
import useVisible from '@hooks/useVisible';
import {MasterItems} from '@modules/record/masterItem';

interface IReportInputRecordProps {
  display?: string;
  value: string;
  onChange: (e: string, id?: string) => void;
  placement?: 'center' | 'bottom' | 'left' | 'right' | 'top';
  animatedPress?: boolean;
  useRehaLabel?: boolean;
}

const ReportInputRecord = (props: IReportInputRecordProps) => {
  const {
    value,
    onChange,
    placement = 'right',
    animatedPress = true,
    useRehaLabel,
    display = '',
  } = props;
  const {t} = useTranslation();
  const {
    isVisible: isShowReportTooltip,
    showComponent: openSettingReportTooltip,
    hideComponent: hideSettingReportTooltip,
  } = useVisible();
  const [lstReportPeriod, setLstReportPeriod] = useState<TextListItem[]>([]);
  const [lstReportPeriodNoCancel, setLstReportPeriodNoCancel] =
    useState<TextListItem[]>();
  const handleReportPeriodList = async () => {
    const lst = await MasterItems.getMasterReportPeriodList();
    setLstReportPeriod(lst!);
  };
  const handleReportPeriodListNoCancel = async () => {
    const lst = await MasterItems.getMasterReportPeriodList();
    setLstReportPeriodNoCancel(lst!.filter(e => e.id !== 'cancel'));
  };
  useEffect(() => {
    handleReportPeriodList();
  }, []);
  useEffect(() => {
    handleReportPeriodListNoCancel();
  }, []);

  const renderFormatDate = (dateToFormat: Date) => {
    const year = dateToFormat.getFullYear();
    const month = dateToFormat.getMonth() + 1;
    const day = dateToFormat.getDate();

    return `${year}${t('common.yearFormat')}${month}${t(
      'common.monthFormat',
    )}${day}${t('common.dayFormat')}${t('bath.post')} `;
  };

  const getDateBySettingReport = (settingReport: string) => {
    const day_report: string = t('report.day_report');
    const month_report: string = t('report.month_report');
    const week_report: string = t('report.week_report');
    //const arrReplace : string[] = [day_report,week_report,month_report];
    const inputValue: string = settingReport
      .replace(day_report, '')
      .replace(week_report, '')
      .replace(month_report, '')
      .trim();
    if (display.length > 0) {
      return renderFormatDate(moment(display).toDate());
    } else if (settingReport === 'cancel') {
      return settingReport;
    } else if (settingReport.includes(day_report)) {
      return renderFormatDate(moment().add(inputValue, 'days').toDate());
    } else if (settingReport.includes(week_report)) {
      return renderFormatDate(moment().add(inputValue, 'weeks').toDate());
    } else if (settingReport.includes(month_report)) {
      return renderFormatDate(moment().add(inputValue, 'months').toDate());
    } else {
      return '';
    }
  };

  const renderSettingReportTooltip = () => {
    return (
      <View style={styles.settingReportContainer}>
        <View style={styles.periodTitleView}>
          <BaseText weight="bold" size="xxLarge" text={t('report.period')} />
        </View>
        <SelectionList
          data={
            value === t('report.remove_choose_report') || !value.length
              ? lstReportPeriodNoCancel!
              : lstReportPeriod!
          }
          onSelectItem={e => {
            onChange(t(e.label), e.id);
            hideSettingReportTooltip();
          }}
          valueChosen={value}
          allowChangeBgChosen
          usingTrans
        />
      </View>
    );
  };

  return (
    <RecordContentItem
      isChoosing={animatedPress && isShowReportTooltip}
      onPress={openSettingReportTooltip}
      title={t('report.bottom_tab_label')}
      showLabel={!useRehaLabel}
      renderLeftView={
        useRehaLabel && (
          <BaseText
            style={styles.labelReha}
            text={`${t('report.bottom_tab_label')}:`}
          />
        )
      }>
      <BaseTooltip
        showHeader
        placement={placement}
        isVisible={isShowReportTooltip}
        onClose={hideSettingReportTooltip}
        closeOnContentInteraction={false}
        leftButtonText={t('user_list.close')}
        onLeftButtonPress={hideSettingReportTooltip}
        content={renderSettingReportTooltip()}
        headerStyle={styles.headerSettingPeriod}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <BaseText
        style={styles.valueView}
        color={
          animatedPress && isShowReportTooltip
            ? Colors.WHITE
            : Colors.TEXT_PRIMARY
        }
        text={getDateBySettingReport(value) || t('report.cancel_choose_report')}
      />
    </RecordContentItem>
  );
};

export default ReportInputRecord;

const styles = StyleSheet.create({
  settingReportContainer: {
    width: 310,
  },
  periodTitleView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
    height: 50,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  targetShowTooltip: {
    width: 120,
    height: 20,
  },
  valueView: {
    marginLeft: -120,
  },
  labelReha: {
    marginRight: 15,
  },
});
