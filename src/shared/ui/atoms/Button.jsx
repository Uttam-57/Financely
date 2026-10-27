import { cn } from "@/shared/utils/cn";
const Button = ({ name, children, className = "", type = "button", ...props }) => {
    return (
        <button
            type={type}
            className={cn(
                "w-full rounded-lg bg-primary px-4 py-2.5 text-sm text-text-2 shadow-md transition-all duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg active:scale-95 active:shadow-sm focus:outline-none disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none cursor-pointer",
                className
            )}
            {...props}
        >
            {name ?? children}
        </button>
    );
};

export default Button;