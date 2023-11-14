import {Linking, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {Row, Rows, Table, TableWrapper} from 'react-native-reanimated-table';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {isURLText} from '@modules/userDetails/userDetails.utils';

export type InfoTableProps = {
  tableHeader: string[];
  tableData: string[][];
  headerWidthArr: number[];
  bodyWidthArr: number[];
  isHaveOrderNumber?: boolean;
};

const InfoTable = ({
  tableHeader,
  tableData,
  headerWidthArr,
  bodyWidthArr,
  isHaveOrderNumber = false,
}: InfoTableProps) => {
  const tableWidth = useMemo(() => {
    const width = bodyWidthArr.reduce((prev, current) => {
      return prev + current;
    }, 0);

    return width;
  }, []);

  const handleOpenLink = (link: string) => {
    Linking.openURL(link);
  };

  const renderBodyText = () => {
    return tableData.map(arr => {
      return arr.map((arrItem, arrItemIndex) => {
        const textParts = arrItem.split(' ');

        return (
          <BaseText
            style={[
              styles.bodyText,
              isHaveOrderNumber && arrItemIndex === 0 && styles.centerText,
            ]}>
            {textParts.map((part, partIndex) => {
              if (isURLText(part)) {
                return (
                  <BaseText
                    key={part + partIndex}
                    style={styles.urlText}
                    onPress={() => handleOpenLink(part)}>
                    {part}
                  </BaseText>
                );
              } else {
                return part;
              }
            })}
          </BaseText>
        );
      });
    });
  };

  return (
    <Table style={{width: tableWidth}} borderStyle={styles.tableBorder}>
      {/* header */}
      <Row
        data={tableHeader}
        widthArr={headerWidthArr}
        style={styles.headerRow}
        textStyle={styles.headerText}
      />

      {/* table body */}
      <TableWrapper style={styles.wrapper}>
        <Rows
          data={renderBodyText()}
          widthArr={bodyWidthArr}
          textStyle={styles.bodyText}
        />
      </TableWrapper>
    </Table>
  );
};

export default InfoTable;

const styles = StyleSheet.create({
  tableBorder: {
    borderWidth: 1,
    borderColor: Colors.GRAY_PH,
  },
  headerRow: {
    height: 40,
    backgroundColor: Colors.LIGHT_GRAY_BACKGROUND,
  },
  headerText: {
    fontWeight: FontWeight.SEMI_BOLD,
    textAlign: 'center',
  },
  wrapper: {
    flexDirection: 'row',
  },
  bodyText: {
    margin: 6,
    fontSize: FontSize.SMALL,
  },
  urlText: {
    color: Colors.PRIMARY,
    textDecorationLine: 'underline',
  },
  centerText: {
    textAlign: 'center',
  },
});
