import {DEMO_ADDRESS} from '@constants/constants';
import {
  AppType,
  ServerConnectionInfo,
  Service,
} from '@modules/setting/setting.type';

/**
 * Represent all service for login demo mode.
 */
export const DEMO_SERVICES: Service[] = [
  {
    serviceType: '施設系サービス',
    serviceName: '特養',
    serviceCode: '-7',
  },
  {
    serviceType: '施設系サービス',
    serviceName: '老健',
    serviceCode: '-6',
  },
  {
    serviceType: '施設系サービス',
    serviceName: '介護医療院',
    serviceCode: '-5',
  },
  {
    serviceType: '施設系サービス',
    serviceName: '地域密着特養',
    serviceCode: '-4',
  },
  {
    serviceType: '入居系サービス',
    serviceName: '特定施設',
    serviceCode: '-3',
  },
  {
    serviceType: '入居系サービス',
    serviceName: 'グループホーム',
    serviceCode: '-2',
  },
  {
    serviceType: '入居系サービス',
    serviceName: '地域密着特定施設',
    serviceCode: '-1',
  },
  {
    serviceType: '通所系サービス',
    serviceName: '通所介護',
    serviceCode: '15',
  },
  {
    serviceType: '通所系サービス',
    serviceName: '通所リハビリ',
    serviceCode: '16',
  },
  {
    serviceType: '通所系サービス',
    serviceName: '認知症対応型通所介護',
    serviceCode: '72',
  },
  {
    serviceType: '通所系サービス',
    serviceName: '地域密着型通所介護',
    serviceCode: '78',
  },
  {
    serviceType: '多機能系サービス',
    serviceName: '小規模多機能',
    serviceCode: '1',
  },
  {
    serviceType: '多機能系サービス',
    serviceName: '看護小規模多機能',
    serviceCode: '2',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '高齢者住宅',
    serviceCode: '5',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '訪問介護',
    serviceCode: '11',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '訪問入浴介護',
    serviceCode: '-8',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '訪問看護',
    serviceCode: '13',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '訪問リハビリ',
    serviceCode: '14',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '福祉用具貸与',
    serviceCode: '17',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '居宅療養管理指導',
    serviceCode: '31',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '夜間対応型訪問介護',
    serviceCode: '71',
  },
  {
    serviceType: '住宅系、および併設サービス',
    serviceName: '定期巡回・随時対応型',
    serviceCode: '76',
  },
];

/**
 * The server connection info of Demo mode.
 */
export const DEMO_CONNECTION: ServerConnectionInfo = {
  id: -2,
  protocol: 'https',
  serverName: DEMO_ADDRESS,
  dbName: '',
  service: null,
  appType: AppType.UNKNOWN,
};

/**
 * The initial server connection info.
 */
export const EMPTY_CONNECTION: ServerConnectionInfo = {
  id: -1,
  protocol: 'http',
  serverName: '',
  dbName: '',
  service: null,
  appType: AppType.UNKNOWN,
};

/**
 * The prefix is used to detect the service.
 *
 * Example: The API responses the object that has "自己_PK_事業所_11" property,
 * "11" is service code
 */
export const DETECT_SERVICE_PREFIX = '自己_PK_事業所_';
