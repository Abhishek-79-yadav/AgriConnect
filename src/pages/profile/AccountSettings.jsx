import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserX, Trash2 } from "lucide-react";

import { deactivateAccountApi, deleteAccountApi } from "../../api/accountApi";
import { logoutThunk } from "../../redux/thunks/authThunk";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function AccountSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await deactivateAccountApi();
      toast.success("Account deactivated. Log back in anytime to reactivate it.");
      await dispatch(logoutThunk());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not deactivate account");
    } finally {
      setDeactivating(false);
      setConfirmingDeactivate(false);
    }
  };

  const handleDelete = async () => {
    if (!password) {
      toast.error("Enter your password to confirm");
      return;
    }
    setDeleting(true);
    try {
      await deleteAccountApi(password);
      toast.success("Account deleted");
      await dispatch(logoutThunk());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Account settings" subtitle="Manage your account." />

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-line bg-card p-5">
          <p className="flex items-center gap-2 font-display text-ink">
            <UserX className="h-4 w-4" /> Deactivate account
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Signs you out and hides your account. Log back in anytime with your password to reactivate it — nothing is deleted.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => setConfirmingDeactivate(true)}>
            Deactivate my account
          </Button>
        </div>

        <div className="rounded-lg border border-rust/30 bg-rust-light/40 p-5">
          <p className="flex items-center gap-2 font-display text-rust">
            <Trash2 className="h-4 w-4" /> Delete account
          </p>
          <p className="mt-1 text-sm text-ink/60">
            This is permanent. Your name, email, and contact details are removed and you won't be able to log back in.
            Order and product history is kept (anonymized) since other people's records still reference it.
          </p>
          <Button variant="danger" className="mt-3" onClick={() => setDeleteOpen(true)}>
            Delete my account
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDeactivate}
        title="Deactivate your account?"
        message="You'll be signed out. Logging back in with your password reactivates it — this is reversible."
        confirmLabel="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setConfirmingDeactivate(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        danger
        confirmLabel="Delete permanently"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setPassword("");
        }}
        message={
          <div className="flex flex-col gap-3">
            <p>This can't be undone. Enter your password to confirm.</p>
            <Input
              type="password"
              placeholder="Current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        }
      />
    </div>
  );
}
