/**
 * TRANSACTION MODEL & SYSTEM CONSTANTS
 * Single source of truth for constants, pure formatting, validation, and aggregations.
 */

/* ==========================================================================
   1. CONSTANTS
   ========================================================================== */

export const PAYMENT_METHODS = [
    { id: "all", label: "All payment" },
    { id: "card", label: "Card" },
    { id: "cash", label: "Cash" },
    { id: "bank", label: "Bank transfer" },
    { id: "online",  label:"Online Payment"},
    { id: "paper", label: "Paper money" },
];

export const TRANSACTION_TYPES = [
    { id: "all", label: "All" },
    { id: "income", label: "Income" },
    { id: "expense", label: "Expense" },
];

export const DATE_RANGES = [
    { id: "all", label: "All time" },
    { id: "this-month", label: "This month" },
    { id: "last-month", label: "Last month" },
    { id: "last-30-days", label: "Last 30 days" },
    { id: "year-to-date", label: "Year to date" },
    { id: "custom", label: "Custom" },
];

export const CATEGORIES = [
    "Salary", "Freelance", "Investment", "Food", "Rent", "Utilities",
    "Entertainment", "Shopping", "Health", "Transport", "Education", "Other"
];

/* ==========================================================================
   2. FORMATTING UTILITIES
   ========================================================================== */

export function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    const clean = String(dateStr).slice(0, 10);
    const m = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : clean;
}

export function formatCurrencyINR(amount) {
    return Number(amount || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    });
}

export function formatCompactINR(value) {
    const num = Math.abs(Number(value) || 0);
    const sign = Number(value) < 0 ? "-" : "";
    if (num >= 1e7) return `${sign}₹${(num / 1e7).toFixed(1).replace(/\.0$/, "")}Cr`;
    if (num >= 1e5) return `${sign}₹${(num / 1e5).toFixed(1).replace(/\.0$/, "")}L`;
    if (num >= 1e3) return `${sign}₹${(num / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
    return `${sign}₹${num}`;
}



/**
 * Universal flexible date parser & normalizer:
 * Detects and normalizes any date representation (Date instance, ISO, text, epoch, Excel) into YYYY-MM-DD.
 */
export function parseFlexibleDate(val) {
    if (!val && val !== 0) return getLocalDateString();
    if (val instanceof Date) return isNaN(val.getTime()) ? getLocalDateString() : getLocalDateString(val);
    if (typeof val?.toDate === "function") return getLocalDateString(val.toDate());
    if (typeof val?.seconds === "number") return getLocalDateString(new Date(val.seconds * 1000));

    const s = String(val).trim();

    // 8-digit date YYYYMMDD
    const ymd8 = s.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (ymd8) {
        return `${ymd8[1]}-${ymd8[2]}-${ymd8[3]}`;
    }

    if (typeof val === "number" || /^\d{5,13}$/.test(s)) {
        const n = Number(val);
        const d = n >= 1e11 ? new Date(n) : n >= 1e9 ? new Date(n * 1000) : new Date((n - 25569) * 864e5);
        return isNaN(d.getTime()) ? getLocalDateString() : getLocalDateString(d);
    }
    const iso = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;

    const delim = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
    if (delim) {
        let [, p1, p2, y] = delim;
        y = Number(y) < 100 ? Number(y) + 2000 : Number(y);
        const [day, mon] = Number(p1) <= 12 && Number(p2) > 12 ? [p2, p1] : [p1, p2];
        return `${y}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    const parsed = new Date(s.replace(/(\d+)-([a-zA-Z]+)|([a-zA-Z]+)-(\d+)/g, "$1$3 $2$4"));
    return isNaN(parsed.getTime()) ? getLocalDateString() : getLocalDateString(parsed);
}

/**
 * Validates and normalizes transaction inputs.
 */
export function validateTransaction(raw) {
    const rawAmount = typeof raw?.amount === "string"
        ? Number(raw.amount.replace(/[^0-9.-]/g, ""))
        : Number(raw?.amount);

    if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
        throw new Error("Amount must be a positive number greater than 0");
    }
    const name = String(raw?.name || "").trim();
    if (!name) throw new Error("Transaction name is required");

    const typeStr = String(raw?.type || "").trim().toLowerCase();
    const isIncome = /^(income|in|credit|cr|deposit|dep)$/i.test(typeStr) ||
                     /\b(income|deposit|credit)\b/i.test(typeStr);
    const type = isIncome ? "income" : "expense";

    const payStr = String(raw?.paymentMethod || "").toLowerCase();
    const paymentMethod = payStr.includes("card") ? "card"
        : payStr.includes("bank") || payStr.includes("upi") || payStr.includes("net") || payStr.includes("wire") ? "bank"
        : payStr.includes("online") ? "online"
        : payStr.includes("paper") || payStr.includes("cheque") || payStr.includes("check") ? "paper"
        : "cash";

    return {
        name,
        amount: Math.round(Math.abs(rawAmount) * 100) / 100,
        type,
        category: String(raw?.category || "").trim() || "Other",
        paymentMethod,
        date: parseFlexibleDate(raw?.date),
        note: String(raw?.note || "").trim(),
        updatedAt: new Date().toISOString(),
    };
}

/* ==========================================================================
   4. SUMMARY AGGREGATION
   ========================================================================== */

export function computeSummaries(transactions = [], paymentMethod = "all") {
    let totalIncome = 0;
    let totalExpense = 0;
    const dailyMap = {};
    const categoryMap = {};

    for (const t of transactions) {
        if (!t || (paymentMethod !== "all" && t.paymentMethod !== paymentMethod)) continue;
        const amt = Number(t.amount) || 0;
        if (amt <= 0 || !Number.isFinite(amt)) continue;

        if (t.type === "income") totalIncome += amt;
        if (t.type === "expense") {
            totalExpense += amt;
            const cat = (t.category || "").trim() || "Other";
            categoryMap[cat] = (categoryMap[cat] || 0) + amt;
        }

        const d = parseFlexibleDate(t.date);
        if (d && (t.type === "income" || t.type === "expense")) {
            if (!dailyMap[d]) dailyMap[d] = { date: d, income: 0, expense: 0 };
            dailyMap[d][t.type] += amt;
        }
    }

    const chartData = Object.values(dailyMap)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((p) => ({ date: p.date, income: Math.round(p.income * 100) / 100, expense: Math.round(p.expense * 100) / 100 }));

    const sorted = Object.entries(categoryMap)
        .map(([name, val]) => ({ name, value: Math.round(val * 100) / 100 }))
        .sort((a, b) => b.value - a.value);

    const pieData = sorted.slice(0, 6);
    const otherTotal = sorted.slice(6).reduce((acc, c) => acc + c.value, 0);
    if (otherTotal > 0) pieData.push({ name: "Other", value: Math.round(otherTotal * 100) / 100 });

    return {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        chartData,
        pieData,
    };
}
