export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectStatus = (state) => state.auth.status;

export const selectError = (state) => state.auth.error;

export const selectIsLogin = (state) =>
    state.auth.status === "login" && state.auth.user !== null;

export const selectIsChecking = (state) =>
    state.auth.status === "checking";