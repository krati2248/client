import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { authApi } from '../features/auth/authApi'
import { jobApi } from '../features/job/jobApi';
import jobReducer from '../features/job/jobSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    job:jobReducer,
    //RTK Query Api
    [authApi.reducerPath]: authApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,jobApi.middleware),
   
});
