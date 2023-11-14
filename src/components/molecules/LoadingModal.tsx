import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ModalProps,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as Progress from 'react-native-progress';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';

interface Props extends ModalProps {
  type: 'pie' | 'circle' | 'none';
  progress?: number;
}

const LoadingModal = ({
  type,
  visible,
  progress,
  animationType = 'none',
}: Props) => {
  const {t} = useTranslation();
  const [loadingDots, setLoadingDots] = useState('.');
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  /**
   * Handle dots animation.
   */
  useEffect(() => {
    if (type === 'none') {
      return;
    }
    if (visible) {
      intervalRef.current = setInterval(() => {
        setLoadingDots(prevDots => (prevDots === '...' ? '.' : prevDots + '.'));
      }, 1000);
    } else {
      setLoadingDots('.');
      clearInterval(intervalRef.current ?? '');
      intervalRef.current = null;
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType={animationType}>
      <View style={styles.modalContainer}>
        {type !== 'none' && (
          <View style={styles.loadingContainer}>
            {/* Circle with customizable width, height, and background color */}
            {type === 'circle' || progress === 0 ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <Progress.Pie
                size={40}
                borderWidth={2}
                progress={progress}
                color={Colors.WHITE}
                borderColor={Colors.WHITE}
                unfilledColor={Colors.TRANSPARENT}
              />
            )}
            {/* Text displaying the loading message */}
            <BaseText
              size="large"
              text={t('common.loading')}
              color={Colors.WHITE}
              weight={'semiBold'}
              style={styles.loadingText}
            />
            {/* Loading dots indicating the loading process */}
            <BaseText
              size="xxLarge"
              text={loadingDots}
              style={styles.loadingDots}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: 100,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  loadingDots: {
    color: Colors.WHITE,
    paddingHorizontal: 3,
  },
  main: {
    position: 'relative',
    width: 200,
    height: 200,
    margin: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default LoadingModal;
