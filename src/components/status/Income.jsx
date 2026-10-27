import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "@/shared/ui";
import { openTransactionForm } from "@/features/transaction/transactionSlice";
import { selectTotalIncome } from "@/features/transaction/transactionSelector";
import { formatCurrencyINR } from "@/hooks/transactionModel";

export default function Income() {
    const dispatch = useDispatch();
    const totalIncome = useSelector(selectTotalIncome);

    return (
        <Card className="p-5 flex flex-col justify-between gap-3">
            <h2 className="text-left font-bold text-xl text-slate-800">Total Income</h2>
            <span className="text-2xl font-mono font-semibold text-emerald-600">{formatCurrencyINR(totalIncome)}</span>
            <Button
                type="button"
                onClick={() => dispatch(openTransactionForm({ type: "income" }))}
            >
                Add Income
            </Button>
        </Card>
    );
}
