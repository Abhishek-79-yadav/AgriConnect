import { useState } from "react";
import toast from "react-hot-toast";

import { changePasswordApi } from "../../api/userApi";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PasswordStrengthHint, { isStrongPassword } from "../../components/common/PasswordStrengthHint";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(form.newPassword)) {
      toast.error("New password must be at least 8 characters and include a letter, a number, and a special character");
      return;
    }

    setSubmitting(true);
    try {
      await changePasswordApi(form);
      toast.success("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Change password" />

      <form onSubmit={submitHandler} className="flex flex-col gap-4 rounded-lg border border-line bg-card p-6">
        <Input label="Current password" type="password" required value={form.currentPassword} onChange={set("currentPassword")} />
        <Input label="New password" type="password" required minLength={8} value={form.newPassword} onChange={set("newPassword")} />
        <PasswordStrengthHint password={form.newPassword} />

        <Button type="submit" loading={submitting} className="self-start">Change password</Button>
      </form>
    </div>
  );
}
