import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { analyticsDashboardThunk } from "../../redux/thunks/dashboardThunk";
import UserChart from "../../components/charts/UserChart";
import SalesChart from "../../components/charts/SalesChart";
import PageHeader from "../../components/common/PageHeader";
import SectionTitle from "../../components/common/SectionTitle";

export default function Analytics() {
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.dashboard.analytics);

  useEffect(() => {
    dispatch(analyticsDashboardThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform trends at a glance." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-5">
          <SectionTitle title="Sales" />
          <SalesChart data={analytics?.sales || []} />
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <SectionTitle title="User growth" />
          <UserChart data={analytics?.users || []} />
        </div>
      </div>
    </div>
  );
}
