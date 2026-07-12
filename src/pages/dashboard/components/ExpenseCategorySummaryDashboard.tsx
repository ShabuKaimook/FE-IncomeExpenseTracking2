import { DashboardCard } from "#/components/DashboardCard";
import { PieChart } from "#/components/charts/PieChart";
import { ClockFading } from "lucide-react";
import { Link } from "@tanstack/react-router";

const ExpenseCategorySummaryDashboard = () => {
  return (
    <DashboardCard
      header={{
        icon: <ClockFading size={16} className="text-primary" />,
        title: "EXPENSE CATEGORY",
      }}
      rightSide={
        <div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
          {/* TODO: link the path */}
          <Link to="/analytic" className="text-primary cursor-pointer">
            <span className="text-primary cursor-pointer">View More</span>
          </Link>
        </div>
      }
    >
      <PieChart data={[]} width={"100%"} outerRadius={70} height={200} />
    </DashboardCard>
  );
};

export default ExpenseCategorySummaryDashboard;