import { createSelector } from "@reduxjs/toolkit";


// Base slice lookup
const tx = (state) => state.transaction;

// Top-level fields
export const selectRawCurrentBalance = (state) => tx(state)?.currentBalance ?? 0;
export const selectSummaries = (state) => tx(state)?.summaries;
export const selectDateRange = (state) => tx(state)?.dateRange;
export const selectTransactionForm = (state) => tx(state)?.form;

// Query fields
export const selectQuery = (state) => tx(state)?.query;
export const selectSearchQuery = (state) => tx(state)?.query?.search;
export const selectTransactionType = (state) => tx(state)?.query?.transactionType;
export const selectPaymentMethod = (state) => tx(state)?.query?.paymentMethod;


// selector of Status
export const selectCurrentBalance = createSelector(
    [selectRawCurrentBalance],
    (balance) => Number(balance || 0)
);

export const selectTotalIncome = createSelector(
    [selectSummaries],
    (summaries) => Number(summaries?.totalIncome || 0)
);

export const selectTotalExpense = createSelector(
    [selectSummaries],
    (summaries) => Number(summaries?.totalExpense || 0)
);

// chart selector

const EMPTY_ARRAY = Object.freeze([]);

export const selectIncomeChartData = createSelector(
    [selectSummaries],
    (summaries) => summaries?.chartData || EMPTY_ARRAY
);

export const selectExpensePieChartData = createSelector(
    [selectSummaries],
    (summaries) => summaries?.pieData || EMPTY_ARRAY
);
