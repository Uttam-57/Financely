import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    status: "",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authCheck(state) {
            state.status = "checking";
            state.error = null;
        },
        authLogin: {
            reducer(state, action) {
                state.user = action.payload;
                state.status = "login";
                state.error = null;
            },
            prepare(rawUser) {
                if (!rawUser) {
                    return { payload: null };
                }
                return {
                    payload: {
                        uid: String(rawUser.uid || ""),
                        email: String(rawUser.email || ""),
                        displayName: String(rawUser.displayName || ""),
                        photoURL: rawUser.photoURL || null,
                    },
                };
            },
        },
        authLogout(state) {
            state.user = null;
            state.status = "logout";
            state.error = null;
        },
        authFailed(state, action) {
            state.user = null;
            state.status = "error";
            state.error = typeof action.payload === "string" 
                ? action.payload 
                : action.payload?.message || "Authentication error";
        },
    },
});

export const {
    authCheck,
    authLogin,
    authLogout,
    authFailed,
} = authSlice.actions;

export default authSlice.reducer;