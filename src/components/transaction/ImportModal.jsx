import { useState } from "react";
import { Button, Modal, Label } from "@/shared/ui";
import { parseCSVFile } from "@/shared/utils/csv";
import { bulkImportTransactions } from "@/hooks/transactionService";

const STRATEGIES = [
    { id: "add", label: "Add & Merge", desc: "Keeps existing records. Merges duplicates.", active: "border-primary bg-blue-50/50" },
    { id: "replace", label: "Replace All", desc: "Deletes previous records and sets imported ones.", active: "border-rose-500 bg-rose-50/50" },
];

export default function ImportModal({ isOpen, onClose, onSuccess, userId }) {
    const [mode, setMode] = useState("add");
    const [parsedData, setParsedData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError("");

        try {
            const items = await parseCSVFile(file);
            if (!items.length) {
                setError("No valid transactions found in this CSV file.");
                setParsedData([]);
            } else {
                setParsedData(items);
            }
        } catch {
            setError("Failed to parse CSV. Please check the file.");
            setParsedData([]);
        }
    };

    const handleImport = async () => {
        if (!userId) return setError("You must be logged in to import transactions.");
        if (!parsedData.length) return setError("Please upload a valid CSV file first.");

        try {
            setIsSubmitting(true);
            setError("");
            const result = await bulkImportTransactions(userId, parsedData, mode);
            onSuccess?.(result);
            setParsedData([]);
            setFileName("");
            onClose();
        } catch (err) {
            setError(err?.message || "Failed to import transactions. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => !isSubmitting && onClose()}
            title="Import Transactions"
            maxWidth="max-w-lg"
        >
            <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Import Strategy
                </Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {STRATEGIES.map((s) => (
                        <label
                            key={s.id}
                            className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-colors ${
                                mode === s.id ? s.active : "border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="importMode"
                                    value={s.id}
                                    checked={mode === s.id}
                                    onChange={() => setMode(s.id)}
                                    className="accent-primary"
                                />
                                <span className="font-semibold text-xs text-slate-800">{s.label}</span>
                            </div>
                            <span className="text-xs text-slate-500 mt-1 pl-5">{s.desc}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    CSV File
                </Label>
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 transition-colors bg-slate-50/50 text-center">
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        id="csv-file-input"
                        className="hidden"
                    />
                    <Label htmlFor="csv-file-input" className="cursor-pointer text-xs font-semibold text-primary hover:underline">
                        {fileName ? "Change CSV File" : "Choose CSV file to upload"}
                    </Label>
                    {fileName && <span className="text-xs text-slate-600 mt-1 font-medium truncate max-w-xs">Selected: {fileName}</span>}
                    {parsedData.length > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 mt-1">
                            ✓ Found {parsedData.length} valid transactions
                        </span>
                    )}
                </div>
            </div>

            {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">{error}</p>}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onClose}
                    className="w-auto px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-none border-none"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    disabled={isSubmitting || parsedData.length === 0}
                    onClick={handleImport}
                    className="w-auto px-5 py-2 text-sm font-semibold"
                >
                    {isSubmitting ? "Importing..." : "Confirm Import"}
                </Button>
            </div>
        </Modal>
    );
}
