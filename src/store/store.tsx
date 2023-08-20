import {createStore} from 'redux';
import {combineReducers} from 'redux';

// Define the initial state and action types
interface AppState {
  dataEmployee: any[]; // Change this type according to your employee data structure
  dataIcTransaction: any[];
  dataOgTransaction: any[];
}

// Define actions and reducers
const initialState: AppState = {
  dataEmployee: [],
  dataIcTransaction: [],
  dataOgTransaction: [],
};

const employeeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_EMPLOYEE_DATA':
      return {...state, dataEmployee: action.payload};
    case 'INPUT_EMPLOYEE_DATA':
      return {...state, dataEmployee: [...state.dataEmployee, action.payload]};
    default:
      return state;
  }
};

const incomingTrReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_INCOMING_DATA':
      return {...state, dataIcTransaction: action.payload};
    case 'INPUT_INCOMING_DATA':
      return {
        ...state,
        dataIcTransaction: [...state.dataIcTransaction, action.payload],
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  incomingTransaction: incomingTrReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
