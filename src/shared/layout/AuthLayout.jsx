import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Card } from "@/shared/ui";

export default function AuthLayout() {
    return (
        <div className="min-h-screen font-light bg-surface-base flex flex-col">
            <header className="sticky top-0 z-30 shrink-0 min-h-16 bg-surface-raise text-text-2 shadow-sm flex items-center">
                <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2.5">
                    <img className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-contain" src="/logo.png" alt="Logo" />
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Financely</h1>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
                <Card className="max-w-md w-full p-5 sm:p-8 my-shadow">
                    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </Card>
            </main>
        </div>
    );
}