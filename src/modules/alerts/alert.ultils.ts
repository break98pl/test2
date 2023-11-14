import {Alert} from 'react-native';
import i18n from 'i18next';

export const handleAlertConfirm = (
  yesButton?: () => void,
  noButton?: () => void,
  cancelButton?: () => void,
) => {
  Alert.alert(
    i18n.t('common.confirmation'),
    i18n.t('popover.content_confirm'),
    [
      {
        text: i18n.t('common.yes'),
        onPress: yesButton,
      },
      {text: i18n.t('common.no'), onPress: noButton},
      {text: i18n.t('common.cancel'), onPress: cancelButton},
    ],
  );
};

export const handleAlertCancel = (
  yesButton?: () => void,
  noButton?: () => void,
) => {
  Alert.alert(
    i18n.t('common.confirmation'),
    i18n.t('popover.content_cancel_selected_value'),
    [
      {text: i18n.t('common.no'), onPress: noButton},
      {
        text: i18n.t('common.yes'),
        onPress: yesButton,
      },
    ],
  );
};

export const handleAlertSave = (
  yesButton?: () => void,
  noButton?: () => void,
  content?: string,
): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(
      i18n.t('common.confirmation'),
      i18n.t(content ? content : 'popover.content_confirm'),
      [
        {
          text: i18n.t('common.no'),
          onPress: () => {
            noButton?.();
            resolve(false);
          },
        },
        {
          text: i18n.t('common.yes'),
          onPress: () => {
            yesButton?.();
            resolve(true);
          },
        },
      ],
    );
  });
};

export const handleAlertConfirmLogout = (
  yesButton?: () => void,
  noButton?: () => void,
) => {
  Alert.alert(
    i18n.t('common.confirmation'),
    i18n.t('auth.confirm_logout_now'),
    [
      {text: i18n.t('common.no'), onPress: noButton},
      {
        text: i18n.t('common.yes'),
        onPress: yesButton,
      },
    ],
  );
};

export const handleAlertNumberWarning = (content?: string) => {
  Alert.alert(
    i18n.t('common.warning'),
    i18n.t(content ? content : 'popover.content_wrong_number'),
  );
};

export const handleAlertUnsyncRecordWarning = () => {
  Alert.alert(
    i18n.t('common.confirmation'),
    i18n.t('auth.exist_unsync_record_warning'),
  );
};

export const handleAlertChooseAtLeastOne = (user: string) => {
  Alert.alert(
    i18n.t('common.warning'),
    i18n.t('elapsed.can_not_register', {text: user}),
  );
};
/* `images.tpSleepOverInProgress` is a reference to an image file that represents the icon
for an ongoing overnight outing plan. */
export const handleAlertNotCreateRecord = () => {
  Alert.alert(
    i18n.t('user_list.warning_alert'),
    i18n.t('user_list.can_not_create_record'),
  );
};

export const handleAlertContentConfirm = (
  content?: string,
): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(i18n.t('common.confirmation'), content, [
      {
        text: i18n.t('common.no'),
        onPress: () => {
          resolve(false);
        },
      },
      {
        text: i18n.t('common.yes'),
        onPress: () => {
          resolve(true);
        },
      },
    ]);
  });
};

export const handleAlertErrorConfirm = (content?: string): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(i18n.t('common.warning'), content, [
      {
        text: i18n.t('common.ok'),
        onPress: () => {
          resolve(true);
        },
      },
    ]);
  });
};
export const handleAlertSaveOption = (
  yesButton?: () => void,
  noButton?: () => void,
  isEdit?: boolean,
): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(
      i18n.t('common.confirmation'),
      i18n.t(
        isEdit ? 'auth.content_confirm_update' : 'auth.content_confirm_create',
      ),
      [
        {
          text: i18n.t('common.no'),
          onPress: () => {
            noButton?.();
            resolve(false);
          },
        },
        {
          text: i18n.t('common.yes'),
          onPress: () => {
            yesButton?.();
            resolve(true);
          },
        },
      ],
    );
  });
};
