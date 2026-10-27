import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { Button } from "@/shared/ui";

const resolveErrorMessage = (err) => {
    if (isRouteErrorResponse(err)) {
        if (typeof err.data === "string" && err.data.trim()) return err.data;
        return err.statusText || "Unexpected navigation error";
    }

    if (typeof err === "string" && err.trim()) return err;
    if (err?.message) return String(err.message);

    return "An unexpected error occurred while loading the page.";
};

export default function ErrorBoundry() {
    const err = useRouteError();

    const title = isRouteErrorResponse(err) ? `Error ${err.status}` : "Something Went Wrong";
    const message = resolveErrorMessage(err);

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-base p-4">
            <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-surface-card p-6 my-shadow">
                <h1 className="text-xl font-semibold text-text-1">{title}</h1>
                <p className="mt-2 text-sm text-slate-600">{message}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-md w-auto px-4 py-2 text-sm font-medium"
                    >
                        Reload Page
                    </Button>

                    <Link
                        to={Routes.HOME}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}