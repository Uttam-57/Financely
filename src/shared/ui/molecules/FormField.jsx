import { useId } from "react";
import Input from "@/shared/ui/atoms/Input";
import Label from "@/shared/ui/atoms/Label";
import { cn } from "@/shared/utils/cn";

export default function FormField({
    id,
    label,
    error,
    className = "",
    inputClass = "",
    ...inputProps
}) {
    const generatedId = useId();
    const fieldId = id || generatedId;

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <Label htmlFor={fieldId}>
                    {label}
                </Label>
            )}

            <Input
                className={inputClass}
                id={fieldId}
                name={inputProps.name || id || fieldId}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                {...inputProps}
            />
            {error && (
                <p
                    id={`${fieldId}-error`}
                    className="text-red-400 text-xs"
                >
                    {error}
                </p>
            )

            }
        </div>
    );
}