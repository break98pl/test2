export class cRoomReservation {
  startDate: string;
  endDate: string;
  tenantCode: string;
  roomCode: string;
  bedNumber: string;

  constructor() {
    this.startDate = '';
    this.endDate = '';
    this.tenantCode = '';
    this.roomCode = '';
    this.bedNumber = '';
  }

  parseFromRawData(record: Record<string, string | null>) {
    if (record['開始日']) {
      this.startDate = record['開始日'];
    }
    if (record['終了日']) {
      this.endDate = record['終了日'];
    }
    if (record['FK_利用者']) {
      this.tenantCode = record['FK_利用者'];
    }
    if (record['FK_部屋コード']) {
      this.roomCode = record['FK_部屋コード'];
    }
    if (record['ベッド番号']) {
      this.bedNumber = record['ベッド番号'];
    }
  }
}
