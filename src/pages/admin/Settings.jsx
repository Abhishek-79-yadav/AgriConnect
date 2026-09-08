import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import Switch from "../../components/ui/Switch";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="max-w-sm rounded-lg border border-line bg-card p-6">
        <div className="flex flex-col gap-5">
          <Switch checked={darkMode} onChange={setDarkMode} label="Dark mode (coming soon)" />
          <Switch checked={emailAlerts} onChange={setEmailAlerts} label="Email alerts for new orders" />
        </div>
      </div>
    </div>
  );
}
