/* eslint no-bitwise: 0 */
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export namespace FileService {
  export const logFilePath = () => {
    const {fs} = RNFetchBlob;
    const dirToSave =
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    console.log('dirToSave: ', dirToSave);
    return `${dirToSave}/fcp4Log.txt`;
  };

  // export const getFileLogContent = async () => {
  //   const isLogContentFileExisted = await RNFetchBlob.fs.exists(logFilePath());
  //   if (isLogContentFileExisted) {
  //     return await RNFetchBlob.fs.readFile(logFilePath(), 'utf8');
  //   } else {
  //     await RNFetchBlob.fs.createFile(logFilePath(), '', 'utf8');
  //     return '';
  //   }
  // };

  export const writeTitle = async (title: string, message: string) => {
    // const dateString = dateTimeStringForLogFromDate(new Date());
    // let logContent = await getFileLogContent();
    // if (!logContent) {
    //   logContent = '';
    // }

    const dateString = '';
    const logContent = `${dateString} ${title}${message} \n------------------------------\n`;
    await RNFetchBlob.fs.appendFile(logFilePath(), logContent, 'utf8');
  };

  // export const writeLogWithHTTPStatus = (
  //   status: number,
  //   errorMessage: string,
  //   apiName: string,
  //   host: string,
  // ) => {
  //   //console.log(
  //   //   `writeLogWithHTTPStatus: status: ${status}, errorMessage: ${errorMessage}, apiName: ${apiName}, host: ${host}, `,
  //   // );
  //   const logHost = host.replace('https://', '');
  //   if (status === 999) {
  //     const message = `Server Name: ${logHost} - APIName: ${apiName} - translate(
  //       'sendReport.error999',
  //     )`;
  //     writeTitle('', message);
  //   } else if (status === 404) {
  //     const message = `Server Name: ${logHost} - APIName: ${apiName} - Not found`;
  //     writeTitle('', message);
  //   } else {
  //     writeTitle('', errorMessage);
  //   }
  // };

  export const writeLogSQL = (query: string, functionName: string) => {
    const logTitle = `${functionName}：SQLite読込に失敗：    データベースの名称を    確認してください。\n`;
    const logBody = `SQL: ${query}`;
    writeTitle(logTitle, logBody).then();
  };

  // export const writeLogLoginFailWithCloudCode = (
  //   cloudCode: string,
  //   staffCode: string,
  //   serverName: string,
  // ) => {
  //   const message = `Authenticate Fail with serverName: ${serverName}, cloudCode: ${cloudCode}, staffCode: ${staffCode}`;
  //   writeTitle('', message);
  // };

  // export const removeLogFile = async (filePath: string = '') => {
  //   await RNFetchBlob.fs.unlink(filePath);
  // };
  //
  // export const clearLogContent = async () => {
  //   await RNFetchBlob.fs.writeFile(logFilePath(), '', 'utf8');
  // };

  // export const getFooterLogWithAdditionInfo = async (additionInfo: {
  //   [key: string]: any;
  // }) => {
  //   const cloudCode =
  //     additionInfo && additionInfo.CLOUD_CODE ? additionInfo.CLOUD_CODE : null;
  //   const appVersion = DeviceInfo.getVersion();
  //   let footerContent = `${moment(new Date())} translate(
  //     'sendReport.footer1',
  //   )\n`;
  //   const androidVersion = 'Platform.constants.Release';
  //   const iosVersion = parseInt(Platform.Version.toString(), 10).toString();
  //
  //   footerContent = `${footerContent}${
  //     Platform.OS === 'ios' ? 'iOS' : 'Android'
  //   } Version: ${Platform.OS === 'android' ? androidVersion : iosVersion}\n`;
  //   footerContent = `${footerContent}translate('sendReport.footer2')\n`;
  //   footerContent = `${footerContent}translate(
  //     'sendReport.appVersion',
  //   ) ${appVersion}\n`;
  //   footerContent = `${footerContent}translate('sendReport.cloudCode') ${
  //     cloudCode ?? 'NULL'
  //   }\n`;
  //   const ipAddress = await DeviceInfo.getIpAddress();
  //   footerContent = `${footerContent}${
  //     Platform.OS === 'ios' ? 'iOS' : 'Android'
  //   } translate(
  //     'sendReport.footer3',
  //   ) ${ipAddress}\n------------------------------\n`;
  //
  //   return footerContent;
  // };

  // export const getLogHeader = async () => {
  //   try {
  //     const fixedInfo = `Content-Type: text/plain; charset=ISO-2022-JP\nContent-Transfer-Encoding: 7bit\n \ntranslate(
  //       'sendReportScreen.app_name',
  //     )\n`;
  //     let deviceName = await DeviceInfo.getDeviceName();
  //     deviceName = deviceName.replace(/ /g, '_').replace(/'/g, '’');
  //     const dateTime = moment(new Date());
  //     const fileName = `${deviceName}_${dateTime}_fcpLog.txt`;
  //     const line = '\n------------------------------\n';
  //     return fixedInfo + fileName + '\n\n' + line;
  //   } catch (err) {
  //     // console.error(err);
  //   }
  // };

  // export const getLogContentWithFileName = async (
  //   fileName: string,
  //   additionInfo: {[key: string]: any},
  // ) => {
  //   const headerContent = await getLogHeader();
  //   const midContent = await getFileLogContent();
  //   const footerContent = await getFooterLogWithAdditionInfo(additionInfo);
  //
  //   // console.log({midContent, headerContent, footerContent});
  //
  //   if (!midContent) {
  //     return `${headerContent}${footerContent}`;
  //   }
  //
  //   return `${headerContent}${midContent}\n${footerContent}`;
  // };

  // export const getFileLogWithInfo = async (info: {[key: string]: any}) => {
  //   try {
  //     const {fs} = RNFetchBlob;
  //     const dirToSave =
  //       Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
  //
  //     const fileName = 'fcassignLog.txt';
  //     const logContent = await getLogContentWithFileName(fileName, info);
  //     const filePath = `${dirToSave}/${fileName}`;
  //     const isLogFileExisted = await RNFetchBlob.fs.exists(filePath);
  //     if (isLogFileExisted) {
  //       await removeLogFile(filePath);
  //     }
  //     await fs.createFile(filePath, logContent, 'utf8');
  //     return filePath;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // export const sendLogWithInfo = async (
  //   info: {[key: string]: any},
  //   onSuccess: () => any,
  //   onError: (arg0?: unknown) => void,
  // ) => {
  //   try {
  //     const filePath = await getFileLogWithInfo(info);
  //     let deviceName = await DeviceInfo.getDeviceName();
  //     const dateString = moment(new Date());
  //     deviceName = deviceName.replace(/ /g, '_').replace(/'/g, '’');
  //     const fileName = `${deviceName}_${dateString}_fcassignLog.txt`;
  //     const formData = new FormData();
  //     formData.append('uploadedfile', {
  //       uri: Platform.OS === 'android' ? `file://${filePath}` : filePath,
  //       type: 'text/plain',
  //       name: fileName,
  //     });
  //     const res = await fetch('https://v7.fc-cloud.jp/aspreport/upload.php', {
  //       method: 'post',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     if (res.status === 200) {
  //       await removeLogFile(filePath);
  //       await clearLogContent();
  //       onSuccess && onSuccess();
  //     } else {
  //       await removeLogFile(filePath);
  //       onError && onError();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     onError(err);
  //   }
  // };

  const binaryToAscii = (input: string) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let data = input;
    let o1;
    let o2;
    let o3;
    let bits;
    let i = 0;
    let acc = '';

    while (i < data.length) {
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      if (o1 > 256 || o2 > 256 || o3 > 256) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      bits = (o1 << 16) | (o2 << 8) | o3;
      acc +=
        chars.charAt((bits >> 18) & 0x3f) +
        chars.charAt((bits >> 12) & 0x3f) +
        chars.charAt((bits >> 6) & 0x3f) +
        chars.charAt(bits & 0x3f);
    }

    switch (data.length % 3) {
      case 0:
        return acc;
      case 1:
        return acc.slice(0, -2) + '==';
      default:
        return acc.slice(0, -1) + '=';
    }
  };

  /**
   * Create a image and save it to document dir.
   *
   * @param photoName
   * @param data
   */
  export const createImage = async (photoName: string, data: string) => {
    let bString = '';
    for (let i = 0; i < data.length; i += 2) {
      bString += String.fromCharCode(parseInt(data.substring(i, i + 2), 16));
    }
    const base64String = binaryToAscii(bString);
    await RNFetchBlob.fs.writeFile(
      `${RNFetchBlob.fs.dirs.DocumentDir}/${photoName}.jpeg`,
      base64String,
      'base64',
    );
  };

  /**
   * Get tenant photo path by its key.
   *
   * @param photoKey
   * @return the photo path if the photo exists in document directory,
   * else return null.
   */
  export const getPhotoPathByKey = async (
    photoKey: string,
  ): Promise<string | null> => {
    if (photoKey === '') {
      return null;
    }

    const photoPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${photoKey}.jpeg`;
    const isPhotoExists = await RNFetchBlob.fs.exists(photoPath);
    if (isPhotoExists) {
      return photoPath;
    }
    return null;
  };

  /**
   * Move file to target Path
   * @param oldPath
   * @param newPath
   */

  export const moveFileToPath = async (oldPath: string, newPath: string) => {
    const existOldFile = await RNFetchBlob.fs.exists(newPath);
    if (existOldFile) {
      await RNFetchBlob.fs.unlink(newPath);
    }
    return await RNFetchBlob.fs.mv(oldPath?.replace('file://', ''), newPath);
  };

  /**
   * Get file name without extension from path
   * @param path
   */

  export const getFileNameFromPath = (path: string): string => {
    const fileNameExtension = path?.replace(/^.*[\\\/]/, '');
    const fileName = fileNameExtension?.substring(
      0,
      fileNameExtension?.lastIndexOf('.'),
    );
    return fileName || '';
  };
}
