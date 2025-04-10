import { API_TOKEN } from '@env';
import { baseApi } from '../BaseApi';


interface UpdateUserProfilePayload {
  MachineName: string;
  file: {
    uri: string;
    name: string;
    filename: string;
    type: string;
  };
  employeeId: string;
  CustomerCode : string;

}


export const profileApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query<any, { employeeId: string | number ,  CustomerCode: string | number, }>({
      query: (payload) => {

      const { employeeId, CustomerCode } = payload;

      console.log('getUserProfile payload', payload);
        
       return {
          url: `GetUserProfile?employeeId=${employeeId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            CustomerCode: CustomerCode.toString(),
          },
        };

      },


      providesTags: ['UserProfile'],
    }),
    updateUserProfile: builder.mutation<any, UpdateUserProfilePayload>({
      query: payload => {
        const {
          MachineName,
          file,
          employeeId,
          CustomerCode,
        } = payload;

        const formData = new FormData();
        formData.append('MachineName', MachineName);
        formData.append(
          'PhotoEmployeeId',
         employeeId,
        );
       
        formData.append('selfie', {
          uri: file.uri,
          name: file.name,
          filename: file.filename,
          type: file.type,
        });

        console.log(' FormData', formData);
        return {
          url: 'ProfilePicture',
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data',
            CustomerCode: CustomerCode.toString(),
          },
        };
      },
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const { useGetUserProfileQuery,useLazyGetUserProfileQuery, useUpdateUserProfileMutation} = profileApi;
