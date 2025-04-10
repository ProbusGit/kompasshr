interface LoginResponse {
    message: string;
    status: number | string;
    data: {employeeId: string | number};
  }
  
  interface LoginApiArgs {
    customerCode: string;
    loginId: string;
    password: string;
  }
  
  interface FCMArgs{
    fcmToken:string ;
  }
  
  export type {LoginResponse, LoginApiArgs,FCMArgs};
  