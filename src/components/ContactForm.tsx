"use client";

import { useState, type FormEvent } from "react";

type ContactFormProps = {
  vehicleId?: number;
  vehicleName?: string;
  compact?: boolean;
};

type ApiResponse = { ok?: boolean; error?: string; message?: string };

export function ContactForm({ vehicleId, vehicleName, compact = false }: ContactFormProps) {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setPending(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      ...(vehicleId ? { vehicleId } : {}),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResponse;
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again.");
      form.reset();
      setNotice({
        kind: "success",
        text: result.message || `Thanks — your message about ${vehicleName || "Missouri City Motor Cars"} has been received.`,
      });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Your message could not be sent. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={`contact-form${compact ? " compact-contact-form" : ""}`} onSubmit={handleSubmit}>
      <div className="contact-form-row">
        <label>
          Your name
          <input name="name" type="text" autoComplete="name" placeholder="Name" required maxLength={120} />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
        </label>
      </div>
      <label>
        Phone number <span className="optional-label">Optional</span>
        <input name="phone" type="tel" autoComplete="tel" placeholder="(000) 000-0000" maxLength={60} />
      </label>
      <label>
        {vehicleName ? "Your message about this vehicle" : "How can we help?"}
        <textarea
          name="message"
          rows={compact ? 4 : 5}
          placeholder={vehicleName ? `I'm interested in the ${vehicleName}...` : "Tell us what you're looking for or how we can help."}
          required
          minLength={5}
          maxLength={4000}
        />
      </label>
      {notice && <p className={`form-notice form-notice-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>{notice.text}</p>}
      <button className="button button-red contact-submit" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send your message"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-privacy-note">Your inquiry goes directly to Missouri City Motor Cars.</p>
    </form>
  );
}
