import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TabComponentProps} from '@templates/SlideTabsModal';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {FilterModalTabs} from './CareListFilterModal';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@store/config';
import {
  selectFilterHiddenReportJobs,
  selectFilterReporterValues,
} from '@modules/careList/careList.slice';
import {RecordReporter} from '@modules/record/record.type';

interface Props extends TabComponentProps {
  setReporter: React.Dispatch<React.SetStateAction<string>>;
  setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInMainTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const CareListFilterReporterTab = ({
  setReporter,
  setIsShowSaveButton,
  setIsInMainTab,
  jumpTo,
}: Props) => {
  const {t} = useTranslation();
  const defaultValue = t('common.everyone'); // elapsed classification default options is "all"

  const defaultItem: TextListItem = {id: 'default', label: defaultValue};

  const reporters = useAppSelector(selectFilterReporterValues);
  const hiddenReporterJobs = useAppSelector(selectFilterHiddenReportJobs);

  /**
   * called when choose a reporter item
   * @param item - item which is chosen
   */
  const onChooseReporter = (item: TextListItem) => {
    if (item.label === defaultValue) {
      setReporter('');
    } else {
      setReporter(item.label);
    }

    setIsShowSaveButton(true);
    setIsInMainTab(true);
    jumpTo(FilterModalTabs.MainTab);
  };

  const getReportersToShow = (reporterArr: RecordReporter[]) => {
    return reporterArr
      .filter(reporter => {
        let currentHiddenJobNumber = 0;

        for (let i = 0; i < reporter.jobs.length; i++) {
          if (hiddenReporterJobs.includes(reporter.jobs[i])) {
            currentHiddenJobNumber += 1;
          }
        }

        // if all the job of current report is hidden at filter main tab then hide the reporter
        if (
          reporter.jobs.length &&
          currentHiddenJobNumber === reporter.jobs.length
        ) {
          return false;
        } else {
          return true;
        }
      })
      .map((reporter, index) => {
        return {id: reporter.name + index, label: reporter.name};
      });
  };

  return (
    <View style={styles.container}>
      <SelectionList
        onSelectItem={onChooseReporter}
        data={[defaultItem, ...getReportersToShow(reporters)]}
      />
    </View>
  );
};

export default CareListFilterReporterTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
