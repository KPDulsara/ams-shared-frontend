import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import billingReducer from '@/features/billing/store/billingSlice';
import utilityReducer from '@/features/utilities/store/utilitySlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  billing: billingReducer,
  utilities: utilityReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
