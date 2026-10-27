import { cn } from "@/shared/utils/cn";

const Label = ({ htmlFor, className = "", children, ...props }) => {
    return (
        <label htmlFor={htmlFor} className={cn("text-xs font-semibold text-slate-700", className)} {...props}>
            {children}
        </label>
    );
};

export default Label;