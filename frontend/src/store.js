import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice.js"

const store = configureStore({
    reducer: {
        userState: userReducer
    }
})

export default store