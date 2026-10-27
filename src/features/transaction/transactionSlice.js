import { createSlice } from "@reduxjs/toolkit";
import { parseFlexibleDate } from "@/hooks/transactionModel";

const initialState = {
    currentBalance: 0,
    summaries: {
        totalIncome: 0,
        totalExpense: 0,
        chartData: [],
        pieData: [],
    },
    query: {
        search: "",
        transactionType: "all",
        paymentMethod: "all",
    },
    dateRange: "all",
    form: null,
};

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        setBalance(state, action) {
            state.currentBalance = Number(action.payload) || 0;
        },
        setSummaries(state, action) {
            state.summaries = action.payload;
        },
        setQuery(state, action) {
            state.query = { ...state.query, ...action.payload };
        },
        setDateRange(state, action) {
            state.dateRange = action.payload;
        },
        openTransactionForm: {
            reducer(state, action) {
                state.form = action.payload;
            },
            prepare(payload) {
                const tx = payload?.transaction;
                return {
                    payload: {
                        type: payload?.type || "expense",
                        openedAt: Date.now(),
                        transaction: tx
                            ? {
                                id: tx.id,
                                name: String(tx.name || ""),
                                amount: Math.abs(Number(tx.amount) || 0),
                                date: tx.date ? parseFlexibleDate(tx.date) : "",
                                paymentMethod: tx.paymentMethod || "cash",
                                category: tx.category || "",
                                note: String(tx.note || ""),
                                type: tx.type || payload?.type || "expense",
                            }
                            : null,
                    },
                };
            },
        },
        closeTransactionForm(state) {
            state.form = null;
        },
        resetFilters(state) {
            state.query = {
                search: "",
                transactionType: "all",
                paymentMethod: "all",
            };
            state.dateRange = "all";
        },
    },
});

export const {
    setBalance,
    setSummaries,
    setQuery,
    setDateRange,
    openTransactionForm,
    closeTransactionForm,
    resetFilters,
} = transactionSlice.actions;

export default transactionSlice.reducer;
