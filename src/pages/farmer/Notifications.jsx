import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";

import { fetchNotificationsThunk, markNotificationReadThunk } from "../../redux/thunks/notificationThunk";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Order alerts and updates for your farm." />

      {loading ? (
        <Loader label="Loading notifications..." />
      ) : !notifications.length ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New order alerts will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.readStatus && dispatch(markNotificationReadThunk(n.id))}
              className={`rounded-lg border p-4 text-left text-sm transition ${
                n.readStatus
                  ? "border-line bg-card text-ink/60"
                  : "border-gold/40 bg-gold-light/40 text-ink hover:bg-gold-light/60"
              }`}
            >
              {n.message}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
