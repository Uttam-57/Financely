import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Card } from "@/shared/ui";

export default function AuthLayout() {
    return (
        <div className="min-h-screen font-light bg-surface-base flex flex-col">
            <header className="sticky top-0 z-30 shrink-0 h-16 bg-surface-raise text-text-2 px-12 content-center">
                <h1 className="text-4xl ">Financely</h1>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-8">
                <Card className="max-w-md sm:p-8">
                    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </Card>
            </main>
        </div>
    );
}