import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";

import { fetchNotificationsThunk } from "../../redux/thunks/notificationThunk";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications);

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="Notifications" />

      {!notifications?.length ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div key={n.id} className={`rounded-lg border p-4 text-sm ${n.read ? "border-line bg-card text-ink/60" : "border-gold/40 bg-gold-light/40 text-ink"}`}>
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
