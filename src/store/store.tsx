// src/store/store.ts

import {createStore} from 'redux';

// Define the initial state and action types
interface AppState {
  dataEmployee: any[]; // Change this type according to your employee data structure
}

// Define actions and reducers
const initialState: AppState = {
  dataEmployee: [],
};

const employeeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_EMPLOYEE_DATA':
      return {...state, dataEmployee: action.payload};
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(employeeReducer);

// Define RootState type
export type RootState = ReturnType<typeof employeeReducer>;

export default store;
