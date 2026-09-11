import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

// Backend's UpdateProfileRequest only accepts these fields — email is
// tied to the account/login and isn't editable through this form.
export default function ProfileForm({ profile, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    mobile: profile?.mobile || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Full name" value={form.name} onChange={set("name")} />
      <Input label="Mobile" value={form.mobile} onChange={set("mobile")} />
      <Input label="Address" value={form.address} onChange={set("address")} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="City" value={form.city} onChange={set("city")} />
        <Input label="State" value={form.state} onChange={set("state")} />
      </div>

      <Button type="submit" loading={submitting} className="mt-2 self-start">
        Save changes
      </Button>
    </form>
  );
}
