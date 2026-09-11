import { useState } from "react";

import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

export default function SchemeForm({ onSubmit, submitting = false }) {
  const [scheme, setScheme] = useState({
    title: "",
    description: "",
    state: "",
    category: "",
    applyLink: "",
  });

  const set = (field) => (e) => setScheme({ ...scheme, [field]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(scheme);
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Title" required placeholder="e.g. PM-KISAN" value={scheme.title} onChange={set("title")} />

      <TextArea label="Description" rows={3} value={scheme.description} onChange={set("description")} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="State" placeholder="Leave blank for all-India" value={scheme.state} onChange={set("state")} />
        <Input label="Category" placeholder="e.g. Subsidy" value={scheme.category} onChange={set("category")} />
      </div>

      <Input label="Apply link" placeholder="https://..." value={scheme.applyLink} onChange={set("applyLink")} />

      <Button type="submit" loading={submitting} className="mt-2 self-start">
        Add scheme
      </Button>
    </form>
  );
}
