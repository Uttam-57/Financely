import { cn } from "@/shared/utils/cn";

export default function Card({ className = "", children, ...props }) {
    return (
        <section className={cn("w-full h-full rounded-xl bg-white my-shadow", className)} {...props}>
            {children}
        </section>
    );
}