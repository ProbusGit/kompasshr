import { API_TOKEN } from '@env';
import { baseApi } from '../BaseApi';

export interface Location {
  locationId: number;
  locationName: string;
  latitude: string;
  longitude: string;
  range: string;
}

export interface GetLocationNamesResponse {
  message: string;
  status: number;
  data: Location[];
}

export const locationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLocationNames: builder.query<GetLocationNamesResponse, {CustomerCode : string}>({
      query: (CustomerCode) => {

        console.log('getLocationNames payload', CustomerCode);
      return{
        url: 'locationName',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          CustomerCode: CustomerCode.toString(),

        },
      }
      },
      providesTags: ['LocationNames'],
    }),
  }),
});

export const { useGetLocationNamesQuery,useLazyGetLocationNamesQuery } = locationApi;
