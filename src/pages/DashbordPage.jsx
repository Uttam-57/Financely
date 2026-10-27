import ExpenceChart from "@/components/charts/ExpencePieChart";
import IncomeChart from "@/components/charts/IncomeBarChart";
import Balance from "@/components/status/Balance";
import Expence from "@/components/status/Expence";
import Income from "@/components/status/Income";
import Filter from "@/components/transaction/Filter";
import SearchBar from "@/components/transaction/SearchBar";
import TransactionTable from "@/components/transaction/TransactionTable";

export default function DashboardPage() {

    return (
        <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 *:rounded-xl">
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 *:rounded-xl">
                <Balance />
                <Income />
                <Expence />
            </div>
            <IncomeChart className="col-span-1 lg:col-span-2 min-h-[320px] sm:min-h-[360px]" />
            <ExpenceChart className="col-span-1 min-h-[320px] sm:min-h-[360px]" />
            <SearchBar className="col-span-1 lg:col-span-2" />
            <Filter />
            <TransactionTable className="col-span-full" />
        </section>
    );
}