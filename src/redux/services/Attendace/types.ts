export interface CheckInOutPayload {
  MachineName: string;
  CheckInOutDateTime: string; // ISO 8601 format
  CheckInOutLatitude: number;
  CheckInOutLongitude: number;
  CheckInOutLocationId: number;
  Remarks?: string;
  file: {
    uri: string;
    name: string;
    filename: string;
    type: string;
  };
  CheckInOutEmployeeId: string; 
  CheckInOutDirection: 'in' | 'out'; // Assuming direction is either 'in' or 'out'
  CustomerCode: string;
}


export interface historyPayload {
  fromdate: string;
  todate: string;
  id: string;
  CustomerCode: string;
}