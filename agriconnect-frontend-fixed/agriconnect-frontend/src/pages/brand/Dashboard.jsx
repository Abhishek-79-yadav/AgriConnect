import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

import axios from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";

export default function BrandDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get("/brand/profile").then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <Loader label="Loading your company profile..." full />;

  return (
    <div>
      <PageHeader title={`Welcome, ${profile.companyName}`} subtitle="Your AgriConnect company dashboard." />

      <div className="rounded-lg border border-line bg-card p-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-gold-dark" />
          <div>
            <p className="font-medium text-ink">{profile.companyName}</p>
            <p className="text-sm text-ink/60">{profile.category || "No category set"}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-ink/70 sm:grid-cols-2">
          <span>Contact: {profile.name}</span>
          <span>Email: {profile.email}</span>
          {profile.mobile && <span>Mobile: {profile.mobile}</span>}
          {profile.gstNumber && <span>GST: {profile.gstNumber}</span>}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/50">
        Product listings and farmer usage analytics are coming soon to this dashboard.
      </p>
    </div>
  );
}
