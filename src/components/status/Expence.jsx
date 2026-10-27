import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "@/shared/ui";
import { openTransactionForm } from "@/features/transaction/transactionSlice";
import { selectTotalExpense } from "@/features/transaction/transactionSelector";
import { formatCurrencyINR } from "@/hooks/transactionModel";

export default function Expence() {
    const dispatch = useDispatch();
    const totalExpense = useSelector(selectTotalExpense);

    return (
        <Card className="p-4 sm:p-5 flex flex-col justify-between gap-3 h-full">
            <h2 className="text-left font-bold text-lg sm:text-xl text-slate-800">Total Expense</h2>
            <span className="text-xl sm:text-2xl font-mono font-semibold text-rose-600 truncate">{formatCurrencyINR(totalExpense)}</span>
            <Button
                type="button"
                onClick={() => dispatch(openTransactionForm({ type: "expense" }))}
                className="mt-1"
            >
                Add Expense
            </Button>
        </Card>
    );
}
