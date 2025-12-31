import { configureStore } from "@reduxjs/toolkit";
import nominaReducer from "./reducers/nominaReducers";
import siappReducer from "./reducers/siappReducers";
import advisorsReducer from "./reducers/advisorsReducers";
import payrollReducer from "./reducers/payrollReducers";
import directionsReducer from "./reducers/directionsReducers";
import coordAdvisorsReducer from "./reducers/coordAdvisorsReducers";
import advisorSalesReducer from "./reducers/advisorSalesSlice";
import advisorInfoReducer from "./reducers/advisorInfoSlice";
import advisorCiapReducer from "./reducers/advisorCiapSlice";
import noveltiesReducer from "./reducers/noveltiesSlice";


const store = configureStore({
  reducer: {
    nomina: nominaReducer,
    siapp: siappReducer,
    coordinatorAdvisors: advisorsReducer,
    payroll: payrollReducer,
    direction: directionsReducer,
    coordAdvisors: coordAdvisorsReducer,
    advisorSales: advisorSalesReducer,
    advisorInfo: advisorInfoReducer,
    advisorCiap: advisorCiapReducer,
    novelties: noveltiesReducer,
  },
});

export default store;
