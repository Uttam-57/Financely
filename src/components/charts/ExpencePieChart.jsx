import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Card } from "@/shared/ui";
import { selectExpensePieChartData } from "@/features/transaction/transactionSelector";
import { formatCurrencyINR } from "@/hooks/transactionModel";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

// 1. LEGEND CONTROLLER (Plain React Component — strictly matches chartData)
function ChartLegend({ items }) {
    if (!items?.length) return null;

    return (
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-3">
            {items.map((item, index) => (
                <li key={`legend-${item.name}-${index}`} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span
                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.fill }}
                    />
                    <span>{item.name}</span>
                </li>
            ))}
        </ul>
    );
}

// 2. HOVER / TOOLTIP CONTROLLER
function renderTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;

    const { name, value, payload: itemPayload } = payload[0];

    return (
        <div className="rounded-lg border border-gray-100 bg-white p-2.5 shadow-md text-xs">
            <div className="flex items-center gap-2 mb-1">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: itemPayload.fill }}
                />
                <span className="font-semibold text-gray-800">{name}</span>
            </div>
            <p className="text-gray-700 font-medium pl-4.5">
                {formatCurrencyINR(value)}
            </p>
        </div>
    );
}

export default function ExpenseChart() {
    const rawData = useSelector(selectExpensePieChartData);

    const chartData = useMemo(() => {
        return (rawData || []).map((item, index) => ({
            ...item,
            fill: COLORS[index % COLORS.length],
        }));
    }, [rawData]);

    return (
        <Card className="p-4 sm:p-5 h-full w-full flex flex-col justify-between">
            <h3 className="mb-2 text-base sm:text-lg font-semibold tracking-wide text-slate-800">
                Total Expense Chart
            </h3>

            {/* Chart Area */}
            {chartData.length === 0 ?
                (
                    <div className="flex flex-1 items-center justify-center p-6">
                        <img
                            src="/assets/images.png"
                            alt="No Data Found"
                            className="max-h-48 w-auto object-contain"
                        />
                    </div>

                ) : (
                    <div className="h-64 w-full [&_*:focus]:outline-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={renderTooltip} />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    startAngle={90}
                                    endAngle={-270}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    stroke="#ffffff"
                                    strokeWidth={1.5}
                                    isAnimationActive={true}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

            {/* Standalone Legend: reads chartData directly in exact descending order */}
            <ChartLegend items={chartData} />
        </Card>
    );
}