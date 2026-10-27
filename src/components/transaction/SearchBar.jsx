import { Input, Card } from "@/shared/ui";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/shared/utils/cn";
import { setQuery } from "@/features/transaction/transactionSlice";
import { selectSearchQuery } from "@/features/transaction/transactionSelector";

export default function SearchBar({ className = "" }) {
    const dispatch = useDispatch();
    const search = useSelector(selectSearchQuery);

    return (
        <Card className={cn("", className)}>
            <Input
                className="border-none px-4"
                id="search-bar"
                aria-label="Search by name"
                type="text"
                placeholder="Search By Name"
                value={search}
                onChange={(event) => dispatch(setQuery({ search: event.target.value }))}
            />
        </Card>
    );
}