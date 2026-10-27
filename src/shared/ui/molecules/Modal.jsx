import { useEffect } from "react";
import Card from "@/shared/ui/organisam/Card";
import Button from "@/shared/ui/atoms/Button";
import { cn } from "@/shared/utils/cn";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md", className }) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <Card className={cn("m-auto h-fit w-full p-6 shadow-2xl flex flex-col gap-4", maxWidth, className)}>
                {title && (
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="w-auto p-1 text-slate-400 hover:text-slate-600 text-lg leading-none bg-transparent hover:bg-slate-100 shadow-none border-none"
                            aria-label="Close"
                        >
                            ✕
                        </Button>
                    </div>
                )}
                {children}
            </Card>
        </div>
    );
}
