import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "@/shared/ui";
import { openTransactionForm } from "@/features/transaction/transactionSlice";
import { selectTotalExpense } from "@/features/transaction/transactionSelector";
import { formatCurrencyINR } from "@/hooks/transactionModel";

export default function Expence() {
    const dispatch = useDispatch();
    const totalExpense = useSelector(selectTotalExpense);

    return (
        <Card className="p-5 flex flex-col justify-between gap-3">
            <h2 className="text-left font-bold text-xl text-slate-800">Total Expense</h2>
            <span className="text-2xl font-mono font-semibold text-rose-600">{formatCurrencyINR(totalExpense)}</span>
            <Button
                type="button"
                onClick={() => dispatch(openTransactionForm({ type: "expense" }))}
            >
                Add Expense
            </Button>
        </Card>
    );
}
