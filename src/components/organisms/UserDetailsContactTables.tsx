import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import InfoTable from './InfoTable';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {
  dummyDoctorInfoTableContent,
  dummyFamilyContactInfoTableContent,
  dummyPharmacyTableContent,
  dummyTenantContactInfoTableContent,
} from '@modules/userDetails/dummyData';
import {FontSize} from '@themes/typography';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';

const UserDetailsContactTables = () => {
  const {t} = useTranslation();

  const tenantContactInfoText = t('user_details.tenantContactInfo');
  const emailText = t('user_details.email');
  const familyContactInfoText = t('user_details.familyContactInfo');
  const fullNameText = t('user_details.fullName');
  const relationshipText = t('user_details.relationship');
  const phoneNumberText = t('user_details.phoneNumber');
  const mobilePhoneNumberText = t('user_details.mobilePhoneNumber');
  const addressText = t('user_details.address');
  const medicalCareText = t('user_details.medicalCare');
  const hospitalNameText = t('user_details.hospitalName');
  const doctorNameText = t('user_details.doctorName');
  const faxText = t('user_details.fax');
  const pharmacyNameText = t('user_details.pharmacyName');
  const personInChargeText = t('user_details.personInCharge');

  const appType = useSelector(selectAppType);

  // tenant contact info table header
  const tenantContactInfoTableHeaders = [
    phoneNumberText,
    mobilePhoneNumberText,
    faxText,
    emailText,
    addressText,
  ];

  // family contact info table header
  const familyContactInfoTableHeaders = [
    '',
    fullNameText,
    relationshipText,
    phoneNumberText,
    mobilePhoneNumberText,
    addressText,
  ];

  // doctor info table header
  const doctorInfoTableHeader = [
    '',
    hospitalNameText,
    doctorNameText,
    phoneNumberText,
    faxText,
    addressText,
  ];

  // pharmacy info table header
  const pharmacyInfoTableHeader = [
    '',
    pharmacyNameText,
    personInChargeText,
    phoneNumberText,
    faxText,
    addressText,
  ];

  return (
    <View style={styles.container}>
      <ScrollView maximumZoomScale={2}>
        <TouchableOpacity activeOpacity={1}>
          {/* tenant contact info table */}
          {appType !== AppType.SHISETSHU && (
            <View style={styles.tableContainer}>
              <BaseText style={styles.tableTitle}>
                {tenantContactInfoText}
              </BaseText>
              <InfoTable
                tableHeader={tenantContactInfoTableHeaders}
                tableData={dummyTenantContactInfoTableContent}
                headerWidthArr={[100, 100, 100, 170, 390]}
                bodyWidthArr={[100, 100, 100, 170, 390]}
                isHaveOrderNumber={true}
              />
            </View>
          )}

          {/* family contact info table */}
          <View style={styles.tableContainer}>
            <BaseText style={styles.tableTitle}>
              {familyContactInfoText}
            </BaseText>
            <InfoTable
              tableHeader={familyContactInfoTableHeaders}
              tableData={dummyFamilyContactInfoTableContent}
              headerWidthArr={[30, 100, 100, 140, 140, 350]}
              bodyWidthArr={[30, 100, 100, 140, 140, 350]}
              isHaveOrderNumber={true}
            />
          </View>

          {/* doctor info table */}
          <View style={styles.tableContainer}>
            <BaseText style={styles.tableTitle}>{medicalCareText}</BaseText>
            <InfoTable
              tableHeader={doctorInfoTableHeader}
              tableData={dummyDoctorInfoTableContent}
              headerWidthArr={[30, 120, 180, 130, 130, 270]}
              bodyWidthArr={[30, 120, 120, 60, 130, 130, 270]}
              isHaveOrderNumber={true}
            />
          </View>

          {/* pharmacy info table */}
          <View style={styles.tableContainer}>
            <InfoTable
              tableHeader={pharmacyInfoTableHeader}
              tableData={dummyPharmacyTableContent}
              headerWidthArr={[60, 110, 160, 130, 130, 270]}
              bodyWidthArr={[60, 110, 160, 130, 130, 270]}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UserDetailsContactTables;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableTitle: {
    marginBottom: 12,
    fontSize: FontSize.X_LARGE,
  },
  tableContainer: {
    marginBottom: 16,
  },
});
