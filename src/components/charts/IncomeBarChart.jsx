import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";

import { setDateRange } from "@/features/transaction/transactionSlice";
import { selectDateRange, selectIncomeChartData } from "@/features/transaction/transactionSelector";
import {
    DATE_RANGES,
    formatCurrencyINR,
    formatCompactINR,
    formatDisplayDate,
} from "@/hooks/transactionModel";
import CustomDateRangeModal from "@/components/charts/CustomDateRangeModal";



export default function IncomeChart({ className }) {
    const dispatch = useDispatch();
    const data = useSelector(selectIncomeChartData);
    const dateRange = useSelector(selectDateRange);
    const [isCustomOpen, setIsCustomOpen] = useState(false);

    const isCustom = dateRange?.startsWith("custom:");
    let customOptionLabel = "Custom";
    if (isCustom) {
        const [, start, end] = dateRange.split(":");
        if (start && end) {
            customOptionLabel = `Custom (${formatDisplayDate(start)} to ${formatDisplayDate(end)})`;
        } else if (start) {
            customOptionLabel = `Custom (From ${formatDisplayDate(start)})`;
        }
    }

    const handleSelectChange = (e) => {
        const val = e.target.value;
        if (val === "custom") {
            setIsCustomOpen(true);
        } else {
            dispatch(setDateRange(val));
        }
    };

    return (
        <Card className={cn("flex h-full min-h-0 flex-col overflow-hidden p-4 sm:p-5", className)}>
            <div className="mb-4 flex flex-wrap shrink-0 items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Financial Statistics</h2>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <p className="text-xs font-semibold text-slate-700 flex items-center">
                        <span className="inline-block h-2 w-2 mr-1.5 rounded-full bg-green-500" />Income
                    </p>
                    <p className="text-xs font-semibold text-slate-700 flex items-center">
                        <span className="inline-block h-2 w-2 mr-1.5 rounded-full bg-red-500" />Expense
                    </p>
                    <select
                        aria-label="Chart date range"
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm outline-none bg-white cursor-pointer"
                        value={isCustom ? "custom" : dateRange}
                        onChange={handleSelectChange}
                    >
                        {DATE_RANGES.map((range) => (
                            <option key={range.id} value={range.id}>
                                {range.id === "custom" && isCustom ? customOptionLabel : range.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {data && data.length > 0 ? (
                <div className="min-h-0 min-w-0 flex-1 [&_*:focus]:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 0, right: 10, left: -10, bottom: 15 }}>
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                                    <stop offset="90%" stopColor="#22c55e" stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#b91c1c" stopOpacity={0.25} />
                                    <stop offset="90%" stopColor="#b91c1c" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8e8f91" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                tickFormatter={formatDisplayDate}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                tickFormatter={formatCompactINR}
                            />
                            <Tooltip
                                labelFormatter={(label) => formatDisplayDate(label)}
                                formatter={(value) => [formatCurrencyINR(value), ""]}
                            />
                            <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={1.5} fill="url(#incomeGradient)" />
                            <Area type="monotone" dataKey="expense" stroke="#b91c1c" strokeWidth={2.5} fill="url(#expenseGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center p-6">
                    <img
                        src="/assets/images.png"
                        alt="No Data Found"
                        className="max-h-48 w-auto object-contain"
                    />
                </div>
            )}

            <CustomDateRangeModal
                isOpen={isCustomOpen}
                onClose={() => setIsCustomOpen(false)}
                onApply={(start, end) => {
                    dispatch(setDateRange(`custom:${start}:${end || ""}`));
                    setIsCustomOpen(false);
                }}
            />
        </Card>
    );
}
