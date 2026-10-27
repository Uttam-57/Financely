import { cn } from "@/shared/utils/cn";

const Input = ({className="",...props}) => {
    return (
        <input
            className={cn("w-full border-b px-1 py-2 text-sm focus:outline-none focus:ring-0",className)}
            {...props}
        />
    )
}

export default Input;