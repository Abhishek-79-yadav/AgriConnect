import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import { fetchUsersThunk, deleteUserThunk } from "../../redux/thunks/adminThunk";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Avatar from "../../components/ui/Avatar";

const ROLE_TONE = { ADMIN: "gold", FARMER: "field", BUYER: "slate" };

export default function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchUsersThunk()).finally(() => setLoading(false));
  }, [dispatch]);

  const confirmDelete = async () => {
    const result = await dispatch(deleteUserThunk(toDelete.id));
    if (deleteUserThunk.fulfilled.match(result)) {
      toast.success("User removed");
    } else {
      toast.error("Failed to remove user");
    }
    setToDelete(null);
  };

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} registered`} />

      {loading ? (
        <Loader label="Loading users..." />
      ) : !users.length ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="rounded-lg border border-line bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} size={28} />
                      <span className="font-medium text-ink">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge text={user.role} tone={ROLE_TONE[user.role] || "neutral"} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setToDelete(user)} className="rounded p-1.5 text-rust hover:bg-rust-light">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Remove user?"
        message={`"${toDelete?.name}" will lose access to their account.`}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
