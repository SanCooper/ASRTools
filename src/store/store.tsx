import {createStore} from 'redux';
import {combineReducers} from 'redux';

// Define the initial state and action types
interface AppState {
  dataEmployee: any[]; // Change this type according to your employee data structure
  dataIcTransaction: any[];
  dataOgTransaction: any[];
  dataStock: any[];
  logActivity: any[];
}

// Define actions and reducers
const initialState: AppState = {
  dataEmployee: [],
  dataIcTransaction: [],
  dataOgTransaction: [],
  dataStock: [],
  logActivity: [],
};

const employeeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_EMPLOYEE_DATA':
      return {...state, dataEmployee: action.payload};
    case 'INPUT_EMPLOYEE_DATA':
      return {...state, dataEmployee: [...state.dataEmployee, action.payload]};
    case 'DELETE_EMPLOYEE_DATA':
      return {
        ...state,
        dataEmployee: state.dataEmployee.filter(
          item => item.idKaryawan !== action.payload,
        ),
      };
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
    case 'DELETE_INCOMING_DATA':
      return {
        ...state,
        dataIcTransaction: state.dataIcTransaction.filter(
          item => item.idPemasukan !== action.payload,
        ),
      };
    default:
      return state;
  }
};

const outgoingTrReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_OUTGOING_DATA':
      return {...state, dataOgTransaction: action.payload};
    case 'INPUT_OUTGOING_DATA':
      return {
        ...state,
        dataOgTransaction: [...state.dataOgTransaction, action.payload],
      };
    case 'DELETE_OUTGOING_DATA':
      return {
        ...state,
        dataOgTransaction: state.dataOgTransaction.filter(
          item => item.idPengeluaran !== action.payload,
        ),
      };
    default:
      return state;
  }
};

const StockReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_STOCK_DATA':
      return {...state, dataStock: action.payload};
    case 'INPUT_STOCK_DATA':
      return {
        ...state,
        dataStock: [...state.dataStock, action.payload],
      };
    case 'DELETE_STOCK_DATA':
      return {
        ...state,
        dataStock: state.dataStock.filter(
          item => item.idBarang !== action.payload,
        ),
      };
    default:
      return state;
  }
};

const logActivityReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ACTIVITY_DATA':
      return {...state, logActivity: action.payload};
    case 'INPUT_ACTIVITY_DATA':
      return {
        ...state,
        logActivity: [action.payload, ...state.logActivity],
      };
    case 'DELETE_ACTIVITY_DATA':
      return {
        ...state,
        logActivity: state.logActivity.filter(
          item => item.idActivity !== action.payload,
        ),
      };
    default:
      return state;
  }
};
const rootReducer = combineReducers({
  employee: employeeReducer,
  incomingTransaction: incomingTrReducer,
  outgoingTransaction: outgoingTrReducer,
  stock: StockReducer,
  activity: logActivityReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
