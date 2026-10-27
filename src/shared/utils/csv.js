import Papa from "papaparse";
import { validateTransaction, parseFlexibleDate } from "@/hooks/transactionModel";

export function exportToCSV(records = [], filename = "transactions.csv") {
    const data = records.map((t) => ({
        Name: t.name,
        Amount: t.amount,
        Date: parseFlexibleDate(t.date),
        Type: t.type || "expense",
        "Payment Method": t.paymentMethod || "cash",
        Category: t.category || "Other",
        Note: t.note || "",
    }));

    const blob = new Blob([Papa.unparse(data)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function findCol(row, keys, keywords) {
    const match = keys.find((k) => {
        const clean = k.toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
        const tokens = clean.split(/\s+/);
        return keywords.some((kw) => {
            if (kw.length <= 2) {
                return tokens.includes(kw);
            }
            return clean.includes(kw) || tokens.some((t) => t.startsWith(kw));
        });
    });
    return match && row[match] !== undefined && row[match] !== null ? String(row[match]).trim() : "";
}

export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: "greedy",
            complete: (results) => {
                if (!Array.isArray(results?.data)) return resolve([]);

                const valid = [];
                for (const row of results.data) {
                    if (!row || typeof row !== "object") continue;
                    const keys = Object.keys(row);
                    if (!keys.length) continue;

                    let amount = findCol(row, keys, ["amount", "price", "val", "total", "cost"]);
                    let type = findCol(row, keys, ["type", "dr", "cr"]);

                    const credit = findCol(row, keys, ["credit", "deposit", "cr"]);
                    const debit = findCol(row, keys, ["debit", "withdrawal", "dr"]);
                    if (!amount) {
                        if (credit && Number(credit.replace(/[^0-9.-]/g, "")) > 0) {
                            amount = credit;
                            type = "income";
                        } else if (debit && Number(debit.replace(/[^0-9.-]/g, "")) > 0) {
                            amount = debit;
                            type = "expense";
                        }
                    }

                    try {
                        valid.push(validateTransaction({
                            name: findCol(row, keys, ["name", "desc", "title", "particular", "trans"]),
                            amount,
                            date: findCol(row, keys, ["date", "time", "day"]),
                            type,
                            category: findCol(row, keys, ["cat", "tag", "group"]) || "Other",
                            paymentMethod: findCol(row, keys, ["pay", "method", "mode"]) || "cash",
                            note: findCol(row, keys, ["note", "remark", "memo"]),
                        }));
                    } catch {
                        // Ignore rows failing validation
                    }
                }
                resolve(valid);
            },
            error: reject,
        });
    });
}
