import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApi';
import {CheckInOutPayload,historyPayload} from './types';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    markAttendance: builder.mutation<any, CheckInOutPayload>({
      query: payload => {
        const {
          MachineName,
          CheckInOutDateTime,
          CheckInOutLatitude,
          CheckInOutLongitude,
          CheckInOutLocationId,
          Remarks,
          file,
          CheckInOutEmployeeId,
          CheckInOutDirection,
          CustomerCode,
        } = payload;

        const formData = new FormData();
        formData.append('MachineName', MachineName);
        formData.append('CheckInOutDateTime', CheckInOutDateTime);
        formData.append('CheckInOutLatitude', CheckInOutLatitude.toString());
        formData.append('CheckInOutLongitude', CheckInOutLongitude.toString());
        formData.append(
          'CheckInOutLocationId',
          CheckInOutLocationId.toString(),
        );
        if (Remarks) formData.append('Remarks', Remarks);
        formData.append(
          'CheckInOutEmployeeId',
          CheckInOutEmployeeId.toString(),
        );
        formData.append('CheckInOutDirection', CheckInOutDirection);
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          filename: file.filename,
          type: file.type,
        });

        console.log('checkin FormData', formData);
        return {
          url: 'checkinout',
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data',
            CustomerCode: CustomerCode.toString(),
          },
        };
      },
      invalidatesTags: ['markattendance'],
    }),


    latestStatus: builder.query<any, {employeeId: string , CustomerCode : string}>({
      query: ({employeeId ,  CustomerCode}) => ({
        url: `latestStatus?employeeId=${employeeId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          CustomerCode: CustomerCode.toString(),
        },
      }),
    }),

    HistoryOfAttendance: builder.query<any,historyPayload >({
      query: ({ fromdate, todate, id, CustomerCode }) => {
          return {
              url: `history?fromdate=${fromdate}&todate=${todate}&id=${id}`,
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                  
                  CustomerCode: CustomerCode.toString(),
              },
          };
      },
      // providesTags: ['attendanceHistory'],
  }),
  


  }),
});

export const {
  useMarkAttendanceMutation,
  useLatestStatusQuery,
  useLazyLatestStatusQuery,
  useHistoryOfAttendanceQuery,
  useLazyHistoryOfAttendanceQuery,
} = attendanceApi;
