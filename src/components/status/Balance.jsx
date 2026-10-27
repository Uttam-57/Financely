import { useSelector } from "react-redux";
import {  Card } from "@/shared/ui";
import { selectCurrentBalance } from "@/features/transaction/transactionSelector";
import { formatCurrencyINR } from "@/hooks/transactionModel";

export default function Balance() {
    const balance = useSelector(selectCurrentBalance);

    return (
        <Card className="p-4 sm:p-5 flex flex-col justify-between gap-3 h-full">
            <h2 className="text-left font-bold text-lg sm:text-xl text-slate-800">Current Balance</h2>
            <span className="text-xl sm:text-2xl font-mono font-semibold text-primary truncate">{formatCurrencyINR(balance)}</span>
        </Card>
    );
}
