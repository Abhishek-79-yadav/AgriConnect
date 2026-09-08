import useNotification from "../../hooks/useNotification";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { Bell } from "lucide-react";

export default function Notifications() {
  const { notifications } = useNotification();

  return (
    <div>
      <PageHeader title="Notifications" />

      {!notifications?.length ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-lg border border-line bg-card p-4 text-sm text-ink/80">
              {item.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
