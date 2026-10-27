import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, FormField, Label } from "@/shared/ui";
import { createTransaction, editTransaction } from "@/hooks/transactionService";
import {
    CATEGORIES,
    PAYMENT_METHODS,
    getLocalDateString,
    formatCurrencyINR,
    parseFlexibleDate,
    validateTransaction,
} from "@/hooks/transactionModel";
import { selectTransactionForm } from "@/features/transaction/transactionSelector";
import { closeTransactionForm } from "@/features/transaction/transactionSlice";

const validPaymentMethods = PAYMENT_METHODS.filter((p) => p.id !== "all");

function StatusFormModal({ formState, user, onSaved, onClose }) {
    const type = formState?.type;
    const transaction = formState?.transaction;

    const [form, setForm] = useState({
        name: transaction?.name || "",
        amount: transaction?.amount ? String(Math.abs(transaction.amount)) : "",
        date: transaction?.date ? parseFlexibleDate(transaction.date) : getLocalDateString(),
        paymentMethod: transaction?.paymentMethod || "cash",
        category: transaction?.category || "",
        note: transaction?.note || "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.category) {
            setError("Name, category, and a positive amount are required.");
            return;
        }

        const data = {
            name: form.name.trim(),
            amount: form.amount,
            date: form.date,
            paymentMethod: form.paymentMethod,
            category: form.category,
            type,
            note: form.note.trim(),
        };

        try {
            validateTransaction(data);
        } catch (validationErr) {
            setError(validationErr.message);
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            if (transaction?.id) {
                await editTransaction(user.uid, transaction.id, data);
            } else {
                await createTransaction(user.uid, data);
            }

            onClose();
            onSaved?.();
        } catch (saveError) {
            setError(saveError?.message || "Unable to save this transaction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => !isSubmitting && onClose()}
            title={`${transaction ? "Edit" : "Add"} ${type === "income" ? "Income" : "Expense"}`}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <FormField
                    id="name"
                    label="Name *"
                    placeholder="Transaction Name"
                    value={form.name}
                    onChange={handleChange}
                    inputClass="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800"
                    required
                />
                <FormField
                    id="amount"
                    label="Amount *"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Amount (positive value only)"
                    value={form.amount}
                    onChange={handleChange}
                    inputClass="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800"
                    required
                />
                {Number(form.amount) > 0 && (
                    <p className="-mt-1 text-xs font-semibold text-slate-600">
                        You Entered: <span className="text-primary">{formatCurrencyINR(form.amount)}</span>
                    </p>
                )}
                <FormField
                    id="date"
                    label="Date *"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    inputClass="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800"
                    required
                />
                <div className="flex flex-col gap-1">
                    <Label htmlFor="category">Category *</Label>
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white outline-none font-normal"
                    >
                        <option value="">Select category *</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white outline-none font-normal"
                    >
                        {validPaymentMethods.map((m) => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                </div>
                <FormField
                    id="note"
                    label="Note (optional)"
                    placeholder="Optional note"
                    value={form.note}
                    onChange={handleChange}
                    inputClass="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="w-auto px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-auto px-5 py-2 text-sm font-semibold"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default function StatusForm({ onSaved }) {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const formState = useSelector(selectTransactionForm);

    if (!formState) return null;

    const formKey = formState.transaction?.id || `${formState.type}_${formState.openedAt || "new"}`;

    return (
        <StatusFormModal
            key={formKey}
            formState={formState}
            user={user}
            onSaved={onSaved}
            onClose={() => dispatch(closeTransactionForm())}
        />
    );
}