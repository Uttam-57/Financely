import { Card } from "@/shared/ui";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "@/features/transaction/transactionSlice";
import { selectTransactionType, selectPaymentMethod } from "@/features/transaction/transactionSelector";
import { TRANSACTION_TYPES, PAYMENT_METHODS } from "@/hooks/transactionModel";

export default function Filter() {
    const dispatch = useDispatch();
    const transactionType = useSelector(selectTransactionType);
    const paymentMethod = useSelector(selectPaymentMethod);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 w-full">
            <Card className="p-1 w-full flex-1">
                <select
                    className="h-full w-full outline-none bg-white px-3 py-2 text-sm text-slate-700 cursor-pointer rounded-lg border border-transparent focus:border-slate-200"
                    id="transaction-type"
                    aria-label="Filter by transaction type"
                    value={transactionType}
                    onChange={(event) => dispatch(setQuery({ transactionType: event.target.value }))}
                >
                    {TRANSACTION_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </Card>
            <Card className="p-1 w-full flex-1">
                <select
                    className="h-full w-full outline-none bg-white px-3 py-2 text-sm text-slate-700 cursor-pointer rounded-lg border border-transparent focus:border-slate-200"
                    id="transaction-payment"
                    aria-label="Filter by payment method"
                    value={paymentMethod}
                    onChange={(event) => dispatch(setQuery({ paymentMethod: event.target.value }))}
                >
                    {PAYMENT_METHODS.map((method) => (
                        <option key={method.id} value={method.id}>
                            {method.label}
                        </option>
                    ))}
                </select>
            </Card>
        </div>
    );
}