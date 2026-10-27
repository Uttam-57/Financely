import {
    collection,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    writeBatch,
} from "firebase/firestore";
import { db } from "@/hooks/firebase";
import { validateTransaction, getLocalDateString, parseFlexibleDate } from "@/hooks/transactionModel";

const getTransactionsRef = (userId) => collection(db, "users", userId, "transactions");

/**
 * Computes YYYY-MM-DD boundary dates for date range queries.
 */
export function getDateBounds(range) {
    if (!range || range === "all") return null;

    const today = new Date();
    const currentYear = today.getFullYear();

    if (typeof range === "string" && range.startsWith("custom:")) {
        const parts = range.split(":");
        return [parts[1], parts[2] || `${currentYear}-12-31`];
    }

    const m = today.getMonth();
    if (range === "this-month") {
        return [getLocalDateString(new Date(currentYear, m, 1)), getLocalDateString(new Date(currentYear, m + 1, 0))];
    }
    if (range === "last-month") {
        return [getLocalDateString(new Date(currentYear, m - 1, 1)), getLocalDateString(new Date(currentYear, m, 0))];
    }
    if (range === "last-30-days") {
        return [getLocalDateString(new Date(currentYear, m, today.getDate() - 29)), getLocalDateString(today)];
    }
    if (range === "year-to-date") {
        return [`${currentYear}-01-01`, getLocalDateString(today)];
    }

    return null;
}

/**
 * Fetch transactions scoped to dateRange.
 */
export async function fetchTransactions(userId, dateRange = "all") {
    if (!userId) return [];
    const bounds = getDateBounds(dateRange);
    const q = bounds
        ? query(
            getTransactionsRef(userId),
            where("date", ">=", bounds[0]),
            where("date", "<=", `${bounds[1]}\uf8ff`),
            orderBy("date", "desc")
        )
        : query(getTransactionsRef(userId), orderBy("date", "desc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        amount: Math.abs(Number(d.data().amount) || 0),
        date: parseFlexibleDate(d.data().date),
    }));
}

/**
 * Fetch overall account balance scalar across all user transactions.
 */
export async function fetchBalance(userId) {
    if (!userId) return 0;
    const snapshot = await getDocs(query(getTransactionsRef(userId)));
    let total = 0;
    snapshot.forEach((d) => {
        const data = d.data();
        const amt = Math.abs(Number(data.amount) || 0);
        total += data.type === "income" ? amt : -amt;
    });
    return Math.round(total * 100) / 100;
}

/**
 * Add a new transaction (validates data, enforces positive amount).
 */
export async function createTransaction(userId, rawData) {
    if (!userId) throw new Error("User ID is required");
    const payload = { ...validateTransaction(rawData), createdAt: new Date().toISOString() };
    const docRef = await addDoc(getTransactionsRef(userId), payload);
    return { id: docRef.id, ...payload };
}

/**
 * Update an existing transaction by document ID.
 */
export async function editTransaction(userId, transactionId, rawData) {
    if (!userId || !transactionId) throw new Error("User ID and Transaction ID are required");
    const validated = validateTransaction(rawData);
    await updateDoc(doc(db, "users", userId, "transactions", transactionId), validated);
    return { id: transactionId, ...validated };
}

/**
 * Delete a transaction by document ID.
 */
export async function removeTransaction(userId, transactionId) {
    if (!userId || !transactionId) throw new Error("User ID and Transaction ID are required");
    return deleteDoc(doc(db, "users", userId, "transactions", transactionId));
}

/**
 * Initializes/ensures root user profile document in Firestore.
 */
export async function initUserDoc(user) {
    if (!user?.uid) return;
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
    }, { merge: true });
}

// Aliases for compatibility
export const addTransaction = createTransaction;
export const updateTransaction = editTransaction;
export const deleteTransaction = removeTransaction;

/**
 * Executes Firestore batch operations in safe chunks of 400 (under 500 operation limit).
 */
async function executeBatches(operations) {
    const CHUNK_SIZE = 400;
    for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
        const batch = writeBatch(db);
        const chunk = operations.slice(i, i + CHUNK_SIZE);
        for (const op of chunk) {
            op(batch);
        }
        await batch.commit();
    }
}

/**
 * Bulk import transactions from CSV (add or replace).
 */
export async function bulkImportTransactions(userId, incoming = [], mode = "add") {
    if (!userId || !incoming.length) return { added: 0, skipped: 0 };
    const ref = getTransactionsRef(userId);
    const existing = await getDocs(ref);
    const operations = [];

    if (mode === "replace") {
        existing.docs.forEach((d) => {
            operations.push((batch) => batch.delete(d.ref));
        });
        incoming.forEach((item) => {
            operations.push((batch) => {
                batch.set(doc(ref), { ...validateTransaction(item), createdAt: new Date().toISOString() });
            });
        });
        await executeBatches(operations);
        return { added: incoming.length, skipped: 0 };
    }

    const getKey = (t) => `${t.name}_${t.amount}_${parseFlexibleDate(t.date)}_${t.type}_${t.paymentMethod}_${t.category}`.toLowerCase();
    const existingKeys = new Set(existing.docs.map((d) => getKey(d.data())));
    let added = 0;
    let skipped = 0;

    for (const item of incoming) {
        const key = getKey(item);
        if (existingKeys.has(key)) {
            skipped++;
        } else {
            existingKeys.add(key);
            operations.push((batch) => {
                batch.set(doc(ref), { ...validateTransaction(item), createdAt: new Date().toISOString() });
            });
            added++;
        }
    }

    if (operations.length > 0) {
        await executeBatches(operations);
    }
    return { added, skipped };
}
