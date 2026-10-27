import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { removeTransaction } from "@/hooks/transactionService";
import useTable from "@/hooks/useTable";
import { openTransactionForm } from "@/features/transaction/transactionSlice";
import { formatCurrencyINR, formatDisplayDate } from "@/hooks/transactionModel";
import StatusForm from "@/components/status/StatusForm";
import DeleteConfirmModal from "@/components/transaction/DeleteConfirmModal";
import ImportModal from "@/components/transaction/ImportModal";
import { exportToCSV } from "@/shared/utils/csv";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";

const editIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function TransactionTable({ className }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        visibleItems,
        filteredRecords = [],
        currentPage,
        pageCount,
        pageSize,
        setPage,
        handleSort,
        getSortIcon,
        error,
        refresh,
    } = useTable();

    const handleEdit = (item) => {
        dispatch(openTransactionForm({ type: item.type, transaction: item }));
    };

    const confirmDelete = async () => {
        if (!user?.uid || !transactionToDelete?.id) return;
        try {
            setIsDeleting(true);
            await removeTransaction(user.uid, transactionToDelete.id);
            refresh();
            setTransactionToDelete(null);
            toast.success("Transaction deleted successfully");
        } catch (err) {
            console.error("Unable to delete transaction:", err);
            toast.error("Failed to delete transaction");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleExport = () => {
        if (!filteredRecords.length) {
            toast.warning("No transactions match the current filter to export.");
            return;
        }
        exportToCSV(filteredRecords, `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    };

    return (
        <div className={cn("flex flex-col gap-4 p-4 h-fit bg-surface-card my-shadow", className)}>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">Transaction Table</h1>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => setIsImportOpen(true)}
                        className="w-auto px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-none border-none"
                    >
                        Import
                    </Button>
                    <Button
                        type="button"
                        onClick={handleExport}
                        className="w-auto px-3.5 py-1.5 text-xs font-semibold bg-primary hover:bg-blue-700 text-white shadow-none border-none"
                    >
                        Export
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left text-sm border-collapse">
                    <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                        <tr>
                            <th className="w-12 text-center py-2.5 px-3">#</th>
                            <th className="w-[30%] py-2.5 px-3">Name</th>
                            <th onClick={() => handleSort("date")} className="w-28 text-center cursor-pointer select-none hover:bg-slate-100 py-2.5 px-3">
                                Date{getSortIcon("date")}
                            </th>
                            <th className="w-24 text-center py-2.5 px-3">Type</th>
                            <th className="w-28 text-center py-2.5 px-3">Payment</th>
                            <th onClick={() => handleSort("amount")} className="w-32 text-right cursor-pointer select-none hover:bg-slate-100 py-2.5 px-3">
                                Amount{getSortIcon("amount")}
                            </th>
                            <th className="w-[24%] py-2.5 px-3">Note</th>
                            <th className="w-24 text-center py-2.5 px-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {visibleItems.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="text-center whitespace-nowrap text-slate-500 py-2.5 px-3">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </td>
                                <td className="font-medium text-slate-900 wrap-break-word py-2.5 px-3">{item.name}</td>
                                <td className="text-slate-600 whitespace-nowrap text-center py-2.5 px-3">{formatDisplayDate(item.date)}</td>
                                <td className="text-center whitespace-nowrap py-2.5 px-3">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                        item.type === "income" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                                    )}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="capitalize text-slate-700 whitespace-nowrap text-center py-2.5 px-3">{item.paymentMethod}</td>
                                <td className={cn("font-medium whitespace-nowrap text-right py-2.5 px-3", item.type === "income" ? "text-emerald-600" : "text-rose-600")}>
                                    {formatCurrencyINR(item.amount)}
                                </td>
                                <td className="text-slate-500 wrap-break-word py-2.5 px-3">{item.note}</td>
                                <td className="py-2.5 px-3">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Button
                                            type="button"
                                            aria-label={`Edit ${item.name}`}
                                            title="Edit"
                                            onClick={() => handleEdit(item)}
                                            className="w-auto p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-none border border-blue-200"
                                        >
                                            {editIcon}
                                        </Button>
                                        <Button
                                            type="button"
                                            aria-label={`Delete ${item.name}`}
                                            title="Delete"
                                            onClick={() => setTransactionToDelete(item)}
                                            className="w-auto p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 shadow-none border border-red-200"
                                        >
                                            {deleteIcon}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {visibleItems.length === 0 && (
                <div className="flex flex-1 items-center justify-center p-6">
                    <img
                        src="/assets/images.png"
                        alt="No Data Found"
                        className="max-h-48 w-auto object-contain"
                    />
                </div>
            )}

            <div className="flex justify-center items-center gap-4 text-sm mt-3">
                <Button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="w-auto px-4 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none border border-slate-200"
                >
                    Previous
                </Button>
                <span className="font-medium text-slate-600">Page {currentPage} of {pageCount}</span>
                <Button
                    type="button"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                    className="w-auto px-4 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none border border-slate-200"
                >
                    Next
                </Button>
            </div>

            <StatusForm onSaved={refresh} />
            <DeleteConfirmModal
                isOpen={Boolean(transactionToDelete)}
                transaction={transactionToDelete}
                isDeleting={isDeleting}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={confirmDelete}
            />
            <ImportModal
                isOpen={isImportOpen}
                userId={user?.uid}
                onClose={() => setIsImportOpen(false)}
                onSuccess={refresh}
            />
        </div>
    );
}
