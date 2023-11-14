import {StyleSheet, View} from 'react-native';
import React from 'react';
import ExcretionTemplateSelectionList, {
  ExcretionTemplateListList,
} from './ExcretionTemplateSelectionList';

interface IExcretionRecordTemplateProps {
  onClose?: () => void;
}

const ExcretionRecordTemplate = (props: IExcretionRecordTemplateProps) => {
  const {onClose} = props;
  // TODO: Mock data remove later
  const excretionTemplateData: ExcretionTemplateListList[] = [
    {
      id: '0',
      content: '?',
    },
    {
      id: '1',
      content: '?',
    },
    {
      id: '2',
      content: '?',
    },
    {
      id: '3',
      content: '?',
    },
    {
      id: '4',
      content: '?',
    },
    {
      id: '5',
      content: '?',
    },
    {
      id: '6',
      content: '?',
    },
    {
      id: '7',
      content: '?',
    },
    {
      id: '8',
      content: '?',
    },
    {
      id: '9',
      content: '?',
    },
    {
      id: '10',
      content: '?',
    },
  ];
  return (
    <View style={styles.container}>
      <ExcretionTemplateSelectionList
        onClose={onClose}
        data={excretionTemplateData}
      />
    </View>
  );
};

export default ExcretionRecordTemplate;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: 540,
  },
});
