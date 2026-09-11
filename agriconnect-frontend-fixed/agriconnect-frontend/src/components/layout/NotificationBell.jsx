import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";

import { fetchNotificationsThunk, markNotificationReadThunk } from "../../redux/thunks/notificationThunk";
import ROLES from "../../constants/roles";

const NOTIFICATIONS_PATH = {
  [ROLES.BUYER]: "/buyer/notifications",
  [ROLES.FARMER]: "/farmer/notifications",
  [ROLES.ADMIN]: "/admin/notifications",
};

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.notification.notifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
    // Cheap polling so a farmer sees a new-order notification without a
    // manual refresh. 30s keeps this light on the backend.
    const interval = setInterval(() => dispatch(fetchNotificationsThunk()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleOpenNotification = (n) => {
    if (!n.readStatus) dispatch(markNotificationReadThunk(n.id));
    setOpen(false);
    navigate(NOTIFICATIONS_PATH[user?.role] || "/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative text-ink/70 transition hover:text-ink"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 mt-2 w-72 overflow-hidden rounded border border-line bg-card shadow-md"
        >
          <div className="border-b border-line px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink/50">
            Notifications
          </div>

          {!notifications.length ? (
            <p className="px-4 py-6 text-center text-sm text-ink/50">You're all caught up</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {notifications.slice(0, 6).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleOpenNotification(n)}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-paper ${
                    n.readStatus ? "text-ink/50" : "font-medium text-ink"
                  }`}
                >
                  {n.message}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setOpen(false);
              navigate(NOTIFICATIONS_PATH[user?.role] || "/");
            }}
            className="block w-full border-t border-line px-4 py-2.5 text-center text-sm font-medium text-gold-dark hover:bg-paper"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}
