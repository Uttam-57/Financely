import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, fetchBalance } from "@/hooks/transactionService";
import { computeSummaries } from "@/hooks/transactionModel";
import { setBalance, setSummaries } from "@/features/transaction/transactionSlice";
import { selectDateRange } from "@/features/transaction/transactionSelector";

export function useTransactions() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const dateRange = useSelector(selectDateRange);

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => {
        setRefreshIndex((prev) => prev + 1);
    }, []);

    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        async function executeFetch() {
            try {
                // Async setState inside the function does NOT trigger the effect error
                setLoading(true);
                setError(null);

                const [txs, bal] = await Promise.all([
                    fetchTransactions(userId, dateRange),
                    fetchBalance(userId),
                ]);

                if (isMounted) {
                    setRecords(txs);
                    dispatch(setBalance(bal));
                    dispatch(setSummaries(computeSummaries(txs)));
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error loading transactions:", err);
                    setError(err?.message || "Failed to load transactions");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        executeFetch();

        return () => {
            isMounted = false;
        };
    }, [userId, dateRange, refreshIndex, dispatch]);

    // If logged out, safely return empty records
    const safeRecords = userId ? records : [];

    return { records: safeRecords, loading, error, refresh };
}
