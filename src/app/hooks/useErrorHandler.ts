import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  AlertConfig,
  APINoInternetError,
  APITimeoutError,
  AppError,
  InsertDBFailedError,
  NotSelectRoomError,
  WrongDatabaseError,
  WrongPasswordError,
  CameraNotGrantedError,
  NoServiceError,
} from '@modules/errors/error.type';
import useLogout from '@hooks/useLogout';

/**
 * Handle showing error alert here.
 */
const useErrorHandler = () => {
  const {t} = useTranslation();
  const {logout} = useLogout();

  /**
   * Get default alert config by error type.
   *
   * @param error
   */
  const getDefaultContentOfErrorAlert = (error: AppError) => {
    let title: string;
    let message: string;
    switch (error.constructor.name) {
      case APINoInternetError.name:
        title = t('auth.wifi_not_connected');
        message = t('auth.err_no_internet');
        break;
      case APITimeoutError.name:
        title = '';
        message = t('auth.err_connect_server_failed');
        break;
      case WrongDatabaseError.name:
        title = t('auth.err_get_db_failed');
        message = t('auth.err_login_cannot_open_database');
        break;
      case WrongPasswordError.name:
        title = t('auth.failed_to_login');
        message = t('auth.err_incorrect_password');
        break;
      case NotSelectRoomError.name:
        title = t('common.warning');
        message = t('auth.err_not_select_room');
        break;
      case InsertDBFailedError.name:
        title = t('common.save_failed');
        message = t('user_list.err_cannot_save_data_to_db');
        break;
      case CameraNotGrantedError.name:
        title = '';
        message = t('alert.err_camera_permission_not_granted');
        break;
      case NoServiceError.name:
        title = t('common.warning');
        message = t('alert.no_service_for_db');
        break;
      default:
        title = '';
        message = t('auth.err_connect_server_failed');
        break;
    }
    return {title, message};
  };

  /**
   * Handle all common error cases.
   *
   * @param error
   * @param alertConfig
   */
  const handleAppError = (
    error: AppError,
    {title, message, buttons, options}: AlertConfig = {},
  ) => {
    const {title: defaultTitle, message: defaultMessage} =
      getDefaultContentOfErrorAlert(error);

    Alert.alert(
      title ? title : defaultTitle,
      message ? message : defaultMessage,
      buttons,
      options,
    );
  };

  /**
   * Handle errors in case the initial data fetching from the server fails.
   *
   * @param e
   * @param onFetchAgain
   */
  const displayAlertWhenFetchingInitialDataFailed = (
    e: any,
    onFetchAgain: () => void,
  ) => {
    handleAppError(e, {
      title: t('common.warning'),
      message: t('user_list.err_get_data_from_server'),
      buttons: [
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: logout,
        },
        {
          text: t('user_list.fetch_again'),
          onPress: onFetchAgain,
        },
      ],
    });
  };

  return {handleAppError, displayAlertWhenFetchingInitialDataFailed};
};

export default useErrorHandler;
