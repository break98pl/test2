import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import NotExistData from './NotExistData';

// TODO: Handle define type of data later
interface ITooltipListDataProps {
  existData?: boolean;
  noDataText?: string;
  children?: React.ReactNode;
  customStyle?: ViewStyle;
}

const TooltipListData = (props: ITooltipListDataProps) => {
  const {existData, noDataText, children, customStyle} = props;
  return (
    <View style={[styles.listContainer, customStyle]}>
      {existData ? children : <NotExistData text={noDataText} />}
    </View>
  );
};

export default TooltipListData;

const styles = StyleSheet.create({
  listContainer: {
    height: 645,
  },
});
