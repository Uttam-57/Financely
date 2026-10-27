import { useState } from "react";
import { Button, Modal, Label, Input } from "@/shared/ui";

const MONTHS = [
    { id: "", label: "All Months (Full Year)" },
    { id: "01", label: "01 - January" },
    { id: "02", label: "02 - February" },
    { id: "03", label: "03 - March" },
    { id: "04", label: "04 - April" },
    { id: "05", label: "05 - May" },
    { id: "06", label: "06 - June" },
    { id: "07", label: "07 - July" },
    { id: "08", label: "08 - August" },
    { id: "09", label: "09 - September" },
    { id: "10", label: "10 - October" },
    { id: "11", label: "11 - November" },
    { id: "12", label: "12 - December" },
];

export default function CustomDateRangeModal({ isOpen, onClose, onApply }) {
    const currentYear = new Date().getFullYear();
    const maxDate = `${currentYear}-12-31`;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState(maxDate);
    const [error, setError] = useState("");

    const applyYearAndMonth = (year, month) => {
        if (!month) {
            setStartDate(`${year}-01-01`);
            setEndDate(`${year}-12-31`);
        } else {
            const lastDay = new Date(year, Number(month), 0).getDate();
            setStartDate(`${year}-${month}-01`);
            setEndDate(`${year}-${month}-${String(lastDay).padStart(2, "0")}`);
        }
        setError("");
    };

    const handleApply = (e) => {
        e.preventDefault();
        if (!startDate) return setError("Start date is required.");
        const finalEnd = endDate || maxDate;
        if (finalEnd < startDate) return setError("End date cannot be earlier than start date.");
        onApply(startDate, endDate ? finalEnd : "");
    };

    const availableYears = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Custom Date Range" maxWidth="max-w-lg">
            <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Quick Pick (Year & Month)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            const yr = Number(e.target.value);
                            setSelectedYear(yr);
                            applyYearAndMonth(yr, selectedMonth);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none font-medium"
                    >
                        {availableYears.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedMonth}
                        onChange={(e) => {
                            const m = e.target.value;
                            setSelectedMonth(m);
                            applyYearAndMonth(selectedYear, m);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none font-medium"
                    >
                        {MONTHS.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form onSubmit={handleApply} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <Label htmlFor="custom-start-date" className="block mb-1.5">Start Date *</Label>
                        <Input
                            id="custom-start-date"
                            type="date"
                            required
                            max={maxDate}
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setError("");
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                        />
                    </div>
                    <div>
                        <Label htmlFor="custom-end-date" className="block mb-1.5">End Date (Optional)</Label>
                        <Input
                            id="custom-end-date"
                            type="date"
                            max={maxDate}
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setError("");
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">{error}</p>}

                <div className="flex flex-wrap justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-auto px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-none border-none"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="w-auto px-5 py-2 text-sm font-semibold">
                        Apply Range
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
