import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";

import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // TODO: there is no contact-message endpoint on the backend yet
  // (no ContactController). Wire this up to a real API call once one
  // exists — for now this just confirms receipt to the user.
  const submitHandler = (e) => {
    e.preventDefault();
    toast.success("Thanks — we'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Contact us</h1>
      <p className="mt-2 text-ink/60">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={submitHandler} className="flex flex-col gap-4 rounded-lg border border-line bg-card p-6">
          <Input label="Name" required value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" required value={form.email} onChange={set("email")} />
          <TextArea label="Message" rows={5} required value={form.message} onChange={set("message")} />
          <Button type="submit" className="self-start">Send message</Button>
        </form>

        <div className="flex flex-col gap-4 text-sm text-ink/70">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gold-dark" /> support@agriconnect.in
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gold-dark" /> +91 98765 43210
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gold-dark" /> Indore, Madhya Pradesh, India
          </div>
        </div>
      </div>
    </div>
  );
}
