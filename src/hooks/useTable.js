import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTransactions } from "@/hooks/useTransactions";
import {
    selectSearchQuery,
    selectTransactionType,
    selectPaymentMethod,
} from "@/features/transaction/transactionSelector";

const PAGE_SIZE = 5;

export default function useTable(pageSize = PAGE_SIZE) {
    const { records, loading, error, refresh } = useTransactions();

    const querySearch = useSelector(selectSearchQuery);
    const transactionType = useSelector(selectTransactionType);
    const paymentMethod = useSelector(selectPaymentMethod);

    const filterKey = `${querySearch || ""}|${transactionType || ""}|${paymentMethod || ""}`;
    const [page, setPage] = useState(1);
    const [prevFilter, setPrevFilter] = useState(filterKey);
    const [sort, setSort] = useState({ key: null, order: "asc" });

    // Auto-reset page to 1 synchronously when filters change
    if (prevFilter !== filterKey) {
        setPrevFilter(filterKey);
        setPage(1);
    }

    const filteredRecords = useMemo(() => {
        const search = (querySearch || "").trim().toLowerCase();

        return records.filter((t) => {
            if (paymentMethod && paymentMethod !== "all" && t.paymentMethod !== paymentMethod) return false;
            if (transactionType && transactionType !== "all" && t.type !== transactionType) return false;
            if (search) {
                const text = `${t.name || ""} ${t.note || ""} ${t.category || ""}`.toLowerCase();
                if (!text.includes(search)) return false;
            }
            return true;
        });
    }, [records, paymentMethod, transactionType, querySearch]);

    const sortedRecords = useMemo(() => {
        if (!sort.key) return filteredRecords;

        return [...filteredRecords].sort((a, b) => {
            const valA = a?.[sort.key] ?? "";
            const valB = b?.[sort.key] ?? "";
            const diff = (typeof valA === "number" || sort.key === "amount")
                ? Number(valA) - Number(valB)
                : String(valA).localeCompare(String(valB), undefined, { numeric: true });
            return sort.order === "asc" ? diff : -diff;
        });
    }, [filteredRecords, sort.key, sort.order]);

    const pageCount = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
    const currentPage = Math.min(Math.max(1, page), pageCount);

    const visibleItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedRecords.slice(start, start + pageSize);
    }, [sortedRecords, currentPage, pageSize]);

    const handleSort = (key) => {
        setPage(1);
        setSort((prev) => ({
            key: prev.key !== key || prev.order === "asc" ? key : null,
            order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
        }));
    };

    const getSortIcon = (key) => (sort.key !== key ? " ↕" : sort.order === "asc" ? " ↑" : " ↓");

    return {
        visibleItems,
        filteredRecords,
        totalResults: sortedRecords.length,
        currentPage,
        pageCount,
        pageSize,
        setPage,
        handleSort,
        getSortIcon,
        loading,
        error,
        refresh,
    };
}
