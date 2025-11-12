import { configureStore } from "@reduxjs/toolkit";
import nominaReducer from "./reducers/nominaReducers";
import siappReducer from "./reducers/siappReducers";

const store = configureStore({
  reducer: {
    nomina: nominaReducer,
    siapp: siappReducer,
  },
});

export default store;
