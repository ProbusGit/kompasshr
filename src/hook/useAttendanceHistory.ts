import { useAppSelector } from '../redux/hook';
import {useHistoryOfAttendanceQuery} from '../redux/services/Attendace/attendanceApiSlice';


const useAttendanceHistory = () => {

  const {user} = useAppSelector(state => state.auth);
  const today = new Date();
  const fromdate = today.toISOString().split('T')[0];
  const todate = today.toISOString().split('T')[0];

  const {data, error, isLoading} = useHistoryOfAttendanceQuery({
    fromdate,
    todate,
    id : user?.employeeId ?? '',
    CustomerCode : user?.customerCode ?? '',
  });

  console.log('Attendance History:', data);

  return {
    history: data,
    error,
    isLoading,
  };
};

export default useAttendanceHistory;
