import axiosClient from '@modules/api/api.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cUserData} from '../../various-registration-information-data/cUserData';
import {cExerciseBaseSchedule} from '../../various-registration-information-data/reha/cExerciseBaseSchedule';
import {cSuperReportDataClass} from '../cSuperReportDataClass';
import {DBOperation} from '@modules/operation/operationService';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';

export class cExerciseBaseReport extends cSuperReportDataClass {
  pkExerciseBase?: number; //PK_機能訓練記録_基本
  fkExercisePlanBase?: number; //FK_機能訓練計画書_基本
  userName?: string; //利用者_氏名
  targetDate?: string; //対象年月日
  reporterId?: string; //報告者
  timeStamp?: string; //記録日時【時刻まで】
  execStatus?: string; //実施状況
  note?: string; //特記事項
  isChargeForExercise?: string; //機能訓練加算を算定

  userData?: cUserData; //職員データ
  reporterName?: string; //報告者氏名

  subExerciseErrorMsg?: string;

  constructor() {
    super();
  }

  async getExtraChargeForExersiceWithFkKey(fkKey: string, strDate: string) {
    let strRet = '1.なし';
    const dbLogic = new DBOperation();
    const queryString = `FK_利用者= '${fkKey}' And SubStr(サービス開始日時,1,10) = '${strDate.substring(
      0,
      10,
    )}'`;

    const arrRec = await dbLogic.getExtraChargeForExerciseWithQWhere(
      queryString,
    );
    const arrRecFromResult =
      await dbLogic.getExtraChargeForExerciseFromResultWithQWhere(queryString);
    let hasExtraChargeOnResult = false;

    if (arrRecFromResult.length > 0) {
      const arrTemp = arrRecFromResult[0].split('：');
      if (arrTemp.length > 1) {
        if (arrTemp[0] === '機能') {
          hasExtraChargeOnResult = true;
          if (arrTemp[1].length > 0) {
            strRet = arrTemp[1];
            strRet = strRet.replace(/・/g, 'と');
          }
        }
      }
    }
    if (!hasExtraChargeOnResult && arrRec.length > 0) {
      const arrTemp = arrRec[0].split('：');
      if (arrTemp.length > 1) {
        if (arrTemp[0] === '機能') {
          if (arrTemp[1].length > 0) {
            strRet = arrTemp[1];
          }
        }
      }
    }
    return strRet;
  }

  async initWithFkKey(fkKey: string, date: string) {
    const {selectedStaff} = getReduxStates('authentication') as AuthState;
    this.fkKey = fkKey;
    this.pkExerciseBase = 0;
    this.targetDate = date;
    this.isChargeForExercise = await this.getExtraChargeForExersiceWithFkKey(
      fkKey,
      date,
    );
    this.newFlag = '1';
    this.updateFlag = '0';
    if (selectedStaff) {
      this.reporterId = selectedStaff?.staffCode;
    }
  }

  isUpdate() {
    let ret;
    if (this.newFlag === '1' || this.updateFlag === '1') {
      ret = true;
    } else {
      ret = false;
    }

    return ret;
  }

  /****************
 利用者_氏名
 ****************/
  strServiceUserName() {
    return this.userName;
  }

  /*************
 対象年月日
 ************/
  strTargetDate() {
    return this.targetDate;
  }

  getExerciseBaseReportWithKeysOfBaseSchedule(
    baseschedule: cExerciseBaseSchedule,
    strViewDate: string,
  ) {
    //DBから基本記録を取得
    // DBOperation *dbLogic = [[DBOperation alloc]init];
    // return   [dbLogic getExerciseBaseReportWithFkUser:baseschedule.fkVisitor
    //                                       andViewDate:strViewDate
    //                                andBaseScheduleKey:baseschedule.pkBasePlanNumber];
  }

  getSqlStringForGettingDataFromServer() {
    // NSString *retString;
    // NSDate *fromDate,*toDate;
    // NSString *strFromDate,*strToDate;
    // NSDateFormatter *dfm =[[NSDateFormatter alloc]init];
    // [dfm setLocale:[NSLocale systemLocale]];
    // [dfm setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"JST"]];
    // [dfm setDateFormat:@"yyyy-MM-dd 00:00:00"];//時・分・秒は0固定
    // toDate = [NSDate dateWithTimeInterval:[cUserControls getTermForGettingData] sinceDate:[NSDate date]];
    // fromDate = [NSDate dateWithTimeInterval:-[cUserControls getTermForGettingData] sinceDate:[NSDate date]];
    // strToDate = [dfm stringFromDate:toDate];
    // strFromDate = [dfm stringFromDate:fromDate];
    // retString = [NSString stringWithFormat:(@"SELECT レコード削除情報,"
    //                                         "レコード更新情報,"
    //                                         "更新キー,"
    //                                         "更新ユーザー情報,"
    //                                         "レコード作成情報,"
    //                                         "PK_機能訓練記録_基本,"
    //                                         "FK_機能訓練計画書_基本,"
    //                                         "FK_利用者,"
    //                                         "利用者_氏名,"
    //                                         "対象年月日,"
    //                                         "報告者,"
    //                                         "設定画面ID,"
    //                                         "記録日時,"
    //                                         "機能訓練加算を算定,"
    //                                         "サービス種類 "
    //                                         "FROM T_日常業務_機能訓練記録01_基本 "
    //                                         "WHERE 対象年月日 <= '%@' "
    //                                         "AND 対象年月日 >= '%@' "
    //                                         "AND レコード削除情報 IS NULL ")
    //              ,strToDate,strFromDate];
    // DBOperation *dbLogic =[[DBOperation alloc]init];
    // NSArray *arrFkKeys;
    // arrFkKeys = [dbLogic getDistinctFK_KeysFromPlanAndResultTables];
    // if ([arrFkKeys count] >0) {
    //     NSMutableString *strWhere;
    //     strWhere = [NSMutableString stringWithString:@"AND FK_利用者 IN ("];
    //     for (NSString *fkkey in arrFkKeys) {
    //         [strWhere appendString:[NSString stringWithFormat:@"'%@',",fkkey]];
    //     }
    //     strWhere = [NSMutableString stringWithString: [strWhere substringToIndex:[strWhere length]-1]];
    //     [strWhere appendString:@")"];
    //     retString = [retString stringByAppendingString:strWhere];
    // }
    // return retString;
  }

  getSqlStringForGettingDataFromServerForDateFrom(
    dateStrFrom: string,
    dateStrTo: string,
    fkKey: string,
  ) {
    let retString = '';

    retString = `SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,PK_機能訓練記録_基本,FK_機能訓練計画書_基本,FK_利用者,利用者_氏名,対象年月日,報告者,設定画面ID,記録日時,機能訓練加算を算定,サービス種類 FROM T_日常業務_機能訓練記録01_基本 WHERE FK_利用者 = '${fkKey}' AND 対象年月日 <= '${dateStrFrom}' AND 対象年月日 >= '${dateStrTo}' AND レコード削除情報 IS NULL `;

    return retString;
  }

  tableName() {
    return 'T_日常業務_機能訓練記録01_基本';
  }

  getMinPrimaryKeyOnTheLocal() {
    // DBOperation *dbLogic = [[DBOperation alloc]init];
    // int temp = [dbLogic getMinNumberForm:@"T_日常業務_機能訓練記録01_基本" inField:@"PK_機能訓練記録_基本"];
    // if (temp > 0) {
    //     temp = 0;
    // }
    // return temp;
  }

  GetUpdateDict() {
    // self->updateDict = [[NSMutableDictionary alloc]init];
    // //Set properties to the field via NSDictionary key like following.
    // if (this.UpdateKey) {
    //     [self->updateDict setObject:this.UpdateKey forKey:@"更新キー"];
    // }
    // if (this.pkExerciseBase) {
    //     [self->updateDict setObject:@(this.pkExerciseBase) forKey:@"PK_機能訓練記録_基本"];
    // }
    // if (this.fkExercisePlanBase) {
    //     [self->updateDict setObject:@(this.fkExercisePlanBase) forKey:@"FK_機能訓練計画書_基本"];
    // }
    // if (this.FK_Key) {
    //     [self->updateDict setObject:this.FK_Key forKey:@"FK_利用者"];
    // }
    // if (this.userName) {
    //     [self->updateDict setObject:this.userName forKey:@"利用者_氏名"];
    // }
    // if (this.targetDate) {
    //     [self->updateDict setObject:this.targetDate forKey:@"対象年月日"];
    // }
    // if (this.reporterId) {
    //     [self->updateDict setObject:this.reporterId forKey:@"報告者"];
    // }
    // if (this.timeStamp) {
    //     [self->updateDict setObject:this.timeStamp forKey:@"記録日時"];
    // }
    // if (this.execStatus) {
    //     [self->updateDict setObject:this.execStatus forKey:@"実施状況"];
    // }
    // if (this.note) {
    //     [self->updateDict setObject:this.note forKey:@"特記事項"];
    // }
    // if (this.isChargeForExercise) {
    //     [self->updateDict setObject:this.isChargeForExercise forKey:@"機能訓練加算を算定"];
    // }
    // if (this.newFlag) {
    //     [self->updateDict setObject:this.newFlag forKey:@"新規フラグ"];
    // }
    // if (this.updateFlag) {
    //     [self->updateDict setObject:this.updateFlag forKey:@"変更フラグ"];
    // }
    // if (this.strSendErrMsg) {
    //     self->updateDict[@"送信エラー"] = this.strSendErrMsg;
    // }
    // if (this.recCreateScreenID) {
    //     self->updateDict[@"設定画面ID"]=this.recCreateScreenID;
    // }
    // if (this.recDeleteInfo) {
    //     self->updateDict[@"レコード削除情報"]=this.recDeleteInfo;
    // }
    // if (this.recUpdateInfo) {
    //     self->updateDict[@"レコード更新情報"]=this.recUpdateInfo;
    // }
    // if (this.recCreateInfo) {
    //     self->updateDict[@"レコード作成情報"]=this.recCreateInfo;
    // }
    // if (this.recupdateUserInfo) {
    //     self->updateDict[@"更新ユーザー情報"]=this.recupdateUserInfo;
    // }
    // //サービス種類は固定
    // NSString* serviceNo=[[NSUserDefaults standardUserDefaults] stringForKey:@"ServiceNo"];
    // self->updateDict[@"サービス種類"] = serviceNo;
    // return self->updateDict;
  }

  SetJSONArray() {
    //   NSMutableArray *postArrayObjects=[[NSMutableArray alloc]init];
    //   NSMutableArray *postArrayKeys=[[NSMutableArray alloc]init];
    //   if ([this.UpdateKey length] != 0 && ![this.UpdateKey isEqualToString:@""] && ![this.newFlag isEqualToString:@"1"]) {
    //       [postArrayObjects addObject:this.UpdateKey];
    //       [postArrayKeys addObject:@"更新キー"];
    // }
    //   //新規の場合は、ローカルDB側に暫定採番したPKキーを送らない
    //   if ([this.newFlag isEqualToString:@"1"]) {
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"PK_機能訓練記録_基本"];
    //   }else{
    //       if (this.pkExerciseBase != 0){
    //           [postArrayObjects addObject:@(this.pkExerciseBase)];
    //           [postArrayKeys addObject:@"PK_機能訓練記録_基本"];
    //       }else{
    //           [postArrayObjects addObject:@"(null)"];
    //           [postArrayKeys addObject:@"PK_機能訓練記録"];
    //       }
    //   }
    //   if (this.fkExercisePlanBase != 0){
    //       [postArrayObjects addObject:@(this.fkExercisePlanBase)];
    //       [postArrayKeys addObject:@"FK_機能訓練計画書_基本"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"FK_機能訓練計画書_基本"];
    //   }
    //   if (this.FK_Key != nil){
    //       [postArrayObjects addObject:this.FK_Key];
    //       [postArrayKeys addObject:@"FK_利用者"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"FK_利用者"];
    //   }
    //   if (this.userName != nil){
    //       [postArrayObjects addObject:this.userName];
    //       [postArrayKeys addObject:@"利用者_氏名"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"利用者_氏名"];
    //   }
    //   if (this.targetDate != nil){
    //       [postArrayObjects addObject:this.targetDate];
    //       [postArrayKeys addObject:@"対象年月日"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"対象年月日"];
    //   }
    //   if (this.reporterId != nil){
    //       [postArrayObjects addObject:this.reporterId];
    //       [postArrayKeys addObject:@"報告者"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"報告者"];
    //   }
    //   if (this.timeStamp != nil){
    //       [postArrayObjects addObject:this.timeStamp];
    //       [postArrayKeys addObject:@"記録日時"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"記録日時"];
    //   }
    //   if (this.execStatus != nil){
    //       [postArrayObjects addObject:this.execStatus];
    //       [postArrayKeys addObject:@"実施状況"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"実施状況"];
    //   }
    //   if (this.note != nil){
    //       [postArrayObjects addObject:this.note];
    //       [postArrayKeys addObject:@"特記事項"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"特記事項"];
    //   }
    //   if (this.isChargeForExercise != nil){
    //       [postArrayObjects addObject:this.isChargeForExercise];
    //       [postArrayKeys addObject:@"機能訓練加算を算定"];
    //   }else{
    //       [postArrayObjects addObject:@"(null)"];
    //       [postArrayKeys addObject:@"機能訓練加算を算定"];
    //   }
    //   [postArrayObjects addObject:@"4"];
    //   [postArrayKeys addObject:@"設定画面ID"];
    //   [postArrayObjects addObject:this.serviceType];
    //   [postArrayKeys addObject:@"サービス種類"];
    //   NSMutableArray *postArray=[NSMutableArray arrayWithObjects:postArrayObjects,postArrayKeys, nil];
    //   return postArray;
  }

  NaiyoString() {
    // NSMutableString *s = [NSMutableString string];
    //   //基本記録の内容表示
    //   NSString *extraCharge = [this.isChargeForExercise componentsSeparatedByString:@"."][1];
    //   if ([extraCharge length]>0) {
    //       [s appendFormat:@"【加算】%@\n",extraCharge];
    //       [s appendString:@"─────────────────────────────\n"];
    //   }
    //   //詳細記録を取得する
    //   DBOperation *dbLogic = [[DBOperation alloc]init];
    //   NSArray *detailRports = [dbLogic getExerciseDetailReportWithFkExerciseBase:this.pkExerciseBase];
    //   //詳細記録ループ
    //   for (int idx = 0; idx < [detailRports count]; idx++) {
    //       cExerciseDetailReport *aDetailReport = detailRports[idx];
    //       [s appendFormat:@"【内容】%@\n",aDetailReport.exName];
    //       //実施
    //       if ([aDetailReport.execedStatus isEqualToString:EXCERCISE_REPO_JISSI_JISSI]) {
    //           [s appendString:@"【実施】"];
    //           //結果値
    //           [s appendFormat:@" %@%@ %@%@ %@%@ \n",
    //            aDetailReport.intensityResult,  [aDetailReport.intensityResult length]>0? aDetailReport.intensityUnit:@"",
    //            aDetailReport.quantityResult, [aDetailReport.quantityResult length]>0? aDetailReport.quantityUnit:@"",
    //            aDetailReport.setCountResult, [aDetailReport.setCountResult length]>0? aDetailReport.setCountUnit:@""];
    //           //時間
    //           [s appendFormat:@"【時間】%@\n",[aDetailReport getStringForCell]];
    //           //ボルグスケール
    //           if (aDetailReport.isShownBorg) {
    //               [s appendFormat:@"【ボルグスケール】%@\n",aDetailReport.borgScale];
    //           }
    //           //達成度
    //           [s appendFormat:@"【達成度】%@\n",aDetailReport.exerciseAchievement];
    //       //中止
    //       }else if([aDetailReport.execedStatus isEqualToString:EXCERCISE_REPO_JISSI_TYUUSHI]){
    //           [s appendString:@"【中止】"];
    //           [s appendFormat:@"%@\n",aDetailReport.reasonForAbort];
    //       }
    //       [s appendFormat:@"【メモ】%@",aDetailReport.note];
    //       //最終行でなければセパレータを入れる
    //       if ((idx < [detailRports count] -1)) {
    //           [s appendString:@"\n─────────────────────────────\n"];
    //       }
    //   }
    // return s;
  }

  ColoredNaiyoString(keyWords: string[]) {
    // 	NSMutableString *s = [NSMutableString string];
    //     NSMutableAttributedString *rtn = [[NSMutableAttributedString alloc] init];
    //     NSMutableAttributedString *rtnTemp = [[NSMutableAttributedString alloc] init];
    //     //基本記録の内容表示
    //     NSString *extraCharge = [this.isChargeForExercise componentsSeparatedByString:@"."][1];
    //     if ([extraCharge length]>0) {
    //         [s appendFormat:@"【加算】%@\n",extraCharge];
    //         [s appendString:@"─────────────────────────────\n"];
    //         rtnTemp = [[NSMutableAttributedString alloc] initWithString:s];
    //         [rtn appendAttributedString:rtnTemp];
    //     }
    //     //詳細記録を取得する
    //     DBOperation *dbLogic = [[DBOperation alloc]init];
    //     NSArray *detailRports = [dbLogic getExerciseDetailReportWithFkExerciseBase:this.pkExerciseBase];
    //     //詳細記録ループ
    //     for (int idx = 0; idx < [detailRports count]; idx++) {
    //         s = [NSMutableString string];
    //         cExerciseDetailReport *aDetailReport = detailRports[idx];
    //         [s appendFormat:@"【内容】%@\n",aDetailReport.exName];
    //         //実施
    //         if ([aDetailReport.execedStatus isEqualToString:EXCERCISE_REPO_JISSI_JISSI]) {
    //             [s appendString:@"【実施】"];
    //             //結果値
    //             [s appendFormat:@" %@%@ %@%@ %@%@ \n",
    //              aDetailReport.intensityResult,  [aDetailReport.intensityResult length]>0? aDetailReport.intensityUnit:@"",
    //              aDetailReport.quantityResult, [aDetailReport.quantityResult length]>0? aDetailReport.quantityUnit:@"",
    //              aDetailReport.setCountResult, [aDetailReport.setCountResult length]>0? aDetailReport.setCountUnit:@""];
    //             //時間
    //             [s appendFormat:@"【時間】%@\n",[aDetailReport getStringForCell]];
    //             //ボルグスケール
    //             if (aDetailReport.isShownBorg) {
    //                 [s appendFormat:@"【ボルグスケール】%@\n",aDetailReport.borgScale];
    //             }
    //             //達成度
    //             [s appendFormat:@"【達成度】%@\n",aDetailReport.exerciseAchievement];
    //             //中止
    //         }else if([aDetailReport.execedStatus isEqualToString:EXCERCISE_REPO_JISSI_TYUUSHI]){
    //             [s appendString:@"【中止】"];
    //             [s appendFormat:@"%@\n",aDetailReport.reasonForAbort];
    //         }
    //         [s appendFormat:@"【メモ】"];
    //         rtnTemp = [[NSMutableAttributedString alloc] initWithString:s];
    //         [rtn appendAttributedString:rtnTemp];
    //         [rtn appendAttributedString:[cBackColorSet getAttributedStringWithKeyWords:keyWords message:aDetailReport.note]];
    //         //最終行でなければセパレータを入れる
    //         if ((idx < [detailRports count] -1)) {
    // //            [s appendAttributedString:@"\n─────────────────────────────\n"];
    //             [rtn appendAttributedString:[[NSMutableAttributedString alloc] initWithString:@"\n─────────────────────────────\n"]];
    //         }
    //     }
    // 	return rtn;
  }

  getServerSqlForSelf() {
    this.recCreateScreenID = '4';
    this.recUpdateUserInfo = '[cUserControls GetUpdateUserString]';

    let strRetSql = '';
    let strSqlBuff = '';

    //記録日時セット
    this.timeStamp = '[cUserControls DateFormatterNowString1]';

    const dictRecordData = this.updateDict;
    //サニタイズ
    dictRecordData.removeObjectForKey('新規フラグ');
    dictRecordData.removeObjectForKey('変更フラグ');
    dictRecordData.removeObjectForKey('送信エラー');

    const arrFieldsOfOneRecord = Object.keys(dictRecordData);
    let aValue = '';
    //レコード更新情報付加
    this.recUpdateInfo = '[cUserControls DateFormatterNowString1]';
    dictRecordData['レコード更新情報'] = this.recUpdateInfo.replace('T', '');

    //UPDATE
    if (parseInt(this.updateDict['PK_機能訓練記録_基本'], 10) >= 0) {
      strSqlBuff = `UPDATE ${this.tableName} SET`;
      arrFieldsOfOneRecord.forEach(aKey => {
        aValue = dictRecordData[aKey];
        let strValue = `${aValue}`;
        if (strValue && strValue.length > 0) {
          //値が文字列なら'でくくる
          if (typeof aValue === 'string') {
            strValue = `'${strValue}'`;
          }
          //SQL文に追加
          strSqlBuff = `${strSqlBuff}${aKey}=${strValue},`;
        }
      });

      if (strSqlBuff.endsWith(',')) {
        strSqlBuff = strSqlBuff.substr(0, strSqlBuff.length - 1);
      }
      strSqlBuff = `${strSqlBuff} WHERE 更新キー='${this.updateDict['更新キー']}'`;

      //INSERT
    } else {
      //         //レコード作成情報付加
      //         this.recCreateInfo = [cUserControls DateFormatterNowString1];
      // //        [dictRecordData setObject: this.recCreateInfo                                                            forKey:@"レコード作成情報"];
      //         [dictRecordData setObject:[this.recCreateInfo stringByReplacingOccurrencesOfString:@"T" withString:@" "] forKey:@"レコード作成情報"];
      //         //仮更新キーを吹っ飛ばす
      //         [dictRecordData removeObjectForKey:@"更新キー"];
      //         //ローカル用PKキーも吹っ飛ばす
      //         [dictRecordData removeObjectForKey:@"PK_機能訓練記録_基本"];
      //         arrFieldsOfOneRecord = [dictRecordData allKeys];
      //         [strSqlBuff appendFormat:@"INSERT INTO %@",this.tableName];
      //         [strSqlBuff appendString:@"("];
      //         //フィールド分ループ
      //         for (NSString *aKey in arrFieldsOfOneRecord) {
      //             if ([aKey isEqualToString:@"送信エラー"]) {
      //                 continue;
      //             }
      //             aValue = [dictRecordData objectForKey:aKey];
      //             NSString *strValue = [NSString stringWithFormat:@"%@",aValue];
      //             if (strValue !=nil && [strValue length] >0) {
      //                 [strSqlBuff appendFormat:@"%@,",aKey];
      //             }
      //         }
      //         //PK_機能訓練記録_基本フィールド追加（最大番号を取得するMAX関数を利用して、サーバー側で採番)
      //         [strSqlBuff appendString:@"PK_機能訓練記録_基本"];
      //         [strSqlBuff appendString:@")SELECT "];
      //         //フィールド分ループ
      //         for (NSString *aKey in arrFieldsOfOneRecord) {
      //             if ([aKey isEqualToString:@"送信エラー"]) {
      //                 continue;
      //             }
      //             aValue = [dictRecordData objectForKey:aKey];
      //             NSString *strValue = [NSString stringWithFormat:@"%@",aValue];
      //             if (strValue !=nil && [strValue length] >0) {
      //                 //値が文字列なら'でくくる
      //                 if ([aValue isKindOfClass:[NSString class]]) {
      //                     strValue = [NSString stringWithFormat:@"'%@'",strValue];
      //                 }
      //                 //SQL文に追加
      //                 [strSqlBuff appendFormat:@"%@,",strValue];
      //             }
      //         }
      //         [strSqlBuff appendFormat:@"ISNULL(max(PK_機能訓練記録_基本),0)+1 FROM %@",this.tableName];
    }

    strRetSql = strSqlBuff;
    return strRetSql;
  }

  async getUpdateKeyAndPkKeyFromServer() {
    let arrRet;
    const strSql = `SELECT TOP 1 更新キー,PK_機能訓練記録_基本 FROM T_日常業務_機能訓練記録01_基本 WHERE FK_利用者 = '${this.fkKey}' AND 対象年月日 = '${this.targetDate}' ORDER BY PK_機能訓練記録_基本 DESC `;

    const response = await axiosClient.doQueryOnSqlServer(strSql);
    if (
      response.key === 200 &&
      response.data &&
      response.data.ROOT &&
      response.data.ROOT['T_日常業務_機能訓練記録01_基本']
    ) {
      const dictARec =
        response.data.ROOT['T_日常業務_機能訓練記録01_基本'].length > 0
          ? response.data.ROOT['T_日常業務_機能訓練記録01_基本'][0]
          : undefined;
      if (dictARec) {
        arrRet = [dictARec['更新キー'], dictARec['PK_機能訓練記録_基本']];
      }
    }

    return arrRet;
  }

  updateSelfKeyesWithDataFromServer() {
    const arrKeys = this.getUpdateKeyAndPkKeyFromServer();
    this.updateKey = arrKeys[0];
    const pk = arrKeys[1];

    this.pkExerciseBase = parseInt(pk, 10);
  }

  isUpdateSub() {
    const blnRet = false;
    //詳細記録を取得する
    // DBOperation *dbLogic = [[DBOperation alloc]init];
    // NSArray *detailRports = [dbLogic getExerciseDetailReportWithFkExerciseBase:this.pkExerciseBase];

    // for (cExerciseDetailReport *aDetailRep in detailRports) {
    //     if (aDetailRep.IsUpdate) {
    //         blnRet = YES;
    //         break;
    //     }

    // }

    return blnRet;
  }

  isSendErrSub() {
    const blnRet = false;
    //詳細記録を取得する
    // DBOperation *dbLogic = [[DBOperation alloc]init];
    // NSArray *detailRports = [dbLogic getExerciseDetailReportWithFkExerciseBase:this.pkExerciseBase];
    // for (cExerciseDetailReport *aDetailRep in detailRports) {
    //     if (aDetailRep.strSendErrMsg !=nil &&![aDetailRep.strSendErrMsg isEqualToString:@""]) {
    //         blnRet = YES;
    //         _subExerciseErrorMsg = aDetailRep.strSendErrMsg;
    //         break;
    //     }

    // }

    return blnRet;
  }

  stringBunlui() {
    return '機能訓練';
  }
  imageBunlui() {
    return 'ast_kinoukunren_tama_koushin';
  }
  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    return control.dateTimeJapanStyleFromString(this.targetDate);
  }
  imagePhoto() {
    return undefined;
  }
  imageActiveity() {
    return undefined;
  }
  stringError() {
    if (this.isSendErrSub) {
      return this.subExerciseErrorMsg;
    } else {
      return this.strSendErrMsg;
    }
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  dateCreateColumn() {
    return '対象年月日';
  }

  tableNameForClass() {
    return 'T_日常業務_機能訓練記録01_基本';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
    timeForReported: string,
  ) {
    return super.getSqlStringForGettingDataFromServerForFK(
      fk_key,
      from_date,
      to_date,
      reported,
      timeForReported,
    );
  }
}
