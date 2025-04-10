

import { API_TOKEN, API_BASE_URL } from '@env';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
console.log("REACT_APP_BASE_URL",API_BASE_URL)
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/`,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,

    },
  }),
  tagTypes: ['markattendance','attendanceHistory','UserProfile', 'LocationNames'],
  endpoints: () => ({}),
});