import { configureStore } from "@reduxjs/toolkit";
import nominaReducer from "./reducers/nominaReducers";
import siappReducer from "./reducers/siappReducers";
import advisorsReducer from "./reducers/advisorsReducers";
import payrollReducer from "./reducers/payrollReducers";
import directionsReducer from "./reducers/directionsReducers";


const store = configureStore({
  reducer: {
    nomina: nominaReducer,
    siapp: siappReducer,
    coordinatorAdvisors: advisorsReducer,
    payroll: payrollReducer,
    direction: directionsReducer,
  },
});

export default store;
