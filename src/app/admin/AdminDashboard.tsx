"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { BrandMark } from "@/components/BrandMark";
import { vehicleTitle } from "@/lib/vehicle-title";

type Photo = { id: number; fileName: string; mimeType: string; sortOrder: number; vehicleId: number };
type AdminVehicle = {
  id: number;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  body: string | null;
  configuration: string | null;
  engine: string | null;
  vin: string;
  price: number | null;
  mileage: number | null;
  status: "available" | "sold";
  photos: Photo[];
};
type AdminMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  vehicleSummary: string | null;
  createdAt: string;
};
type ApiError = { error?: string };

function money(value: number | null) {
  if (value == null) return "Price not listed";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function VehicleEditor({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: AdminVehicle | null;
  onClose: () => void;
  onSave: (form: FormData, id?: number) => Promise<string | null>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const saveError = await onSave(form, vehicle?.id);
      if (saveError) setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin-editor-modal" role="dialog" aria-modal="true" aria-labelledby="vehicle-editor-title">
        <div className="admin-editor-heading">
          <div>
            <span className="admin-eyebrow">LISTING DETAILS</span>
            <h2 id="vehicle-editor-title">{vehicle ? "Edit vehicle" : "Add a vehicle"}</h2>
            <p>Enter only details you have. Price and mileage are optional.</p>
          </div>
          <button className="icon-close-button" type="button" aria-label="Close form" onClick={onClose}>×</button>
        </div>
        <form className="admin-vehicle-form" onSubmit={submit}>
          <div className="form-grid form-grid-four">
            <label>Year<input name="year" type="number" min="1886" max={new Date().getFullYear() + 2} required defaultValue={vehicle?.year ?? ""} /></label>
            <label>Make<input name="make" type="text" required maxLength={80} placeholder="Toyota" defaultValue={vehicle?.make ?? ""} /></label>
            <label>Model<input name="model" type="text" required maxLength={120} placeholder="Corolla" defaultValue={vehicle?.model ?? ""} /></label>
            <label>Trim<input name="trim" type="text" maxLength={120} placeholder="LE" defaultValue={vehicle?.trim ?? ""} /></label>
          </div>
          <div className="form-grid form-grid-three">
            <label>Body<input name="body" type="text" placeholder="4D Sedan" defaultValue={vehicle?.body ?? ""} /></label>
            <label>Configuration<input name="configuration" type="text" placeholder="4WD Crew Cab" defaultValue={vehicle?.configuration ?? ""} /></label>
            <label>Engine<input name="engine" type="text" placeholder="3.5L" defaultValue={vehicle?.engine ?? ""} /></label>
          </div>
          <div className="form-grid form-grid-three">
            <label>VIN<input name="vin" type="text" required maxLength={32} placeholder="Enter VIN exactly as supplied" defaultValue={vehicle?.vin ?? ""} /></label>
            <label>Price <span className="admin-field-optional">Optional</span><input name="price" type="number" min="0" step="1" placeholder="Leave blank if unavailable" defaultValue={vehicle?.price ?? ""} /></label>
            <label>Mileage <span className="admin-field-optional">Optional</span><input name="mileage" type="number" min="0" step="1" placeholder="Leave blank if unavailable" defaultValue={vehicle?.mileage ?? ""} /></label>
          </div>
          <div className="form-grid form-grid-two">
            <label>Availability
              <select name="status" defaultValue={vehicle?.status ?? "available"}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </label>
            <label className="photo-upload-label">Vehicle photos
              <input
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(event) => setFileNames(Array.from(event.target.files ?? []).map((file) => file.name))}
              />
            </label>
          </div>
          <div className="upload-helper">
            <span className="upload-helper-icon" aria-hidden="true">↑</span>
            <p>
              {vehicle?.photos.length
                ? `${vehicle.photos.length} photo${vehicle.photos.length === 1 ? "" : "s"} currently in this listing. New uploads are added to the gallery.`
                : "Choose JPG, PNG, WebP, or AVIF files. Up to 12 photos, 8 MB each."}
              {fileNames.length > 0 && <strong className="selected-file-list">Selected: {fileNames.join(", ")}</strong>}
            </p>
          </div>
          {error && <p className="form-notice form-notice-error" role="alert">{error}</p>}
          <div className="admin-editor-actions">
            <button className="button button-quiet" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="button button-red" type="submit" disabled={saving}>
              {saving ? "Saving…" : vehicle ? "Save changes" : "Add vehicle"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  const [configured, setConfigured] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [pageError, setPageError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null);
  const [successNote, setSuccessNote] = useState("");

  async function loadDashboard() {
    setLoadingData(true);
    setPageError("");
    try {
      const [vehicleResponse, messageResponse] = await Promise.all([
        fetch("/api/admin/vehicles", { cache: "no-store" }),
        fetch("/api/admin/inquiries", { cache: "no-store" }),
      ]);
      const vehicleData = (await vehicleResponse.json()) as { vehicles?: AdminVehicle[]; error?: string };
      const messageData = (await messageResponse.json()) as { messages?: AdminMessage[]; error?: string };
      if (!vehicleResponse.ok || !messageResponse.ok) {
        throw new Error(vehicleData.error || messageData.error || "Unable to load the dashboard.");
      }
      setVehicles(vehicleData.vehicles ?? []);
      setMessages(messageData.messages ?? []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to load the dashboard.");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch("/api/admin/auth", { cache: "no-store" });
        const access = (await response.json()) as { configured?: boolean; authenticated?: boolean };
        setConfigured(Boolean(access.configured));
        setAuthenticated(Boolean(access.authenticated));
        if (access.authenticated) await loadDashboard();
      } catch {
        setLoginError("Could not connect to the owner portal. Refresh and try again.");
      } finally {
        setChecking(false);
      }
    }
    void checkAccess();
    // Load once when the owner portal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as ApiError & { authenticated?: boolean };
      if (!response.ok) throw new Error(result.error || "Sign-in failed.");
      setAuthenticated(true);
      setPassword("");
      await loadDashboard();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Sign-in failed.");
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setVehicles([]);
    setMessages([]);
  }

  async function saveVehicle(form: FormData, id?: number) {
    setPageError("");
    const response = await fetch(id ? `/api/admin/vehicles/${id}` : "/api/admin/vehicles", {
      method: id ? "PUT" : "POST",
      body: form,
    });
    const result = (await response.json()) as ApiError;
    if (!response.ok) return result.error || "The vehicle could not be saved.";
    setEditorOpen(false);
    setEditingVehicle(null);
    setSuccessNote(id ? "Vehicle details updated." : "Vehicle added to your inventory.");
    await loadDashboard();
    window.setTimeout(() => setSuccessNote(""), 4000);
    return null;
  }

  async function changeStatus(vehicle: AdminVehicle) {
    const nextStatus = vehicle.status === "sold" ? "available" : "sold";
    const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const result = (await response.json()) as ApiError;
    if (!response.ok) setPageError(result.error || "The status could not be updated.");
    else {
      setSuccessNote(nextStatus === "sold" ? "Vehicle marked as sold." : "Vehicle marked as available.");
      await loadDashboard();
      window.setTimeout(() => setSuccessNote(""), 4000);
    }
  }

  async function removeVehicle(vehicle: AdminVehicle) {
    if (!window.confirm(`Remove the ${vehicleTitle(vehicle)} listing and its photos? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "DELETE" });
    const result = (await response.json()) as ApiError;
    if (!response.ok) setPageError(result.error || "The listing could not be removed.");
    else {
      setSuccessNote("Listing removed.");
      await loadDashboard();
      window.setTimeout(() => setSuccessNote(""), 4000);
    }
  }

  const availableCount = vehicles.filter((vehicle) => vehicle.status === "available").length;
  const soldCount = vehicles.filter((vehicle) => vehicle.status === "sold").length;

  if (checking) {
    return <main className="admin-gate-shell"><div className="admin-loading-card"><span className="loading-spinner" />Checking owner access…</div></main>;
  }

  if (!authenticated) {
    return (
      <main className="admin-gate-shell">
        <Link href="/" className="admin-back-link">← Back to website</Link>
        <section className="admin-login-card">
          <BrandMark />
          <div className="admin-login-icon" aria-hidden="true">MC</div>
          <span className="admin-eyebrow">OWNER PORTAL</span>
          <h1>Manage your inventory</h1>
          <p className="admin-login-intro">Sign in to add vehicles, update listings, and review customer messages.</p>
          {configured ? (
            <form className="admin-login-form" onSubmit={login}>
              <label htmlFor="admin-password">Admin password</label>
              <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
              {loginError && <p className="form-notice form-notice-error" role="alert">{loginError}</p>}
              <button className="button button-red" type="submit">Sign in <span aria-hidden="true">→</span></button>
            </form>
          ) : (
            <div className="admin-setup-note" role="status">
              <strong>One-time setup needed</strong>
              <p>Set a private <code>ADMIN_PASSWORD</code> environment variable in your hosting settings, then refresh this page to sign in.</p>
              {loginError && <p className="form-notice form-notice-error">{loginError}</p>}
            </div>
          )}
          <p className="admin-security-note"><span aria-hidden="true">●</span> This owner area is protected from public access.</p>
        </section>
        <p className="admin-gate-footer">Missouri City Motor Cars · Inventory management</p>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div className="site-container admin-topbar-inner">
          <BrandMark compact />
          <div className="admin-topbar-right">
            <span className="admin-session-label"><span />Owner dashboard</span>
            <Link href="/" className="admin-public-link">View website <span aria-hidden="true">↗</span></Link>
            <button type="button" className="admin-logout-button" onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <div className="site-container admin-main">
        <div className="admin-welcome-row">
          <div>
            <span className="admin-eyebrow">DEALERSHIP OWNER</span>
            <h1>Your inventory, <span>under control.</span></h1>
            <p>Add a vehicle, keep details current, and mark a listing sold when it’s time.</p>
          </div>
          <button type="button" className="button button-red admin-add-button" onClick={() => { setEditingVehicle(null); setEditorOpen(true); }}>
            <span aria-hidden="true">＋</span> Add a vehicle
          </button>
        </div>

        {pageError && <p className="form-notice form-notice-error admin-global-notice" role="alert">{pageError}</p>}
        {successNote && <p className="admin-success-notice" role="status">✓ {successNote}</p>}

        <section className="admin-stat-grid" aria-label="Inventory overview">
          <article className="admin-stat-card"><span>Available listings</span><strong>{availableCount}</strong><small>Visible to customers</small></article>
          <article className="admin-stat-card"><span>Marked sold</span><strong>{soldCount}</strong><small>Kept here for your records</small></article>
          <article className="admin-stat-card"><span>Customer messages</span><strong>{messages.length}</strong><small>Latest messages are below</small></article>
        </section>

        <section className="admin-section-card">
          <div className="admin-section-heading">
            <div><span className="admin-eyebrow">YOUR VEHICLES</span><h2>Inventory listings</h2></div>
            {loadingData && <span className="admin-refresh-indicator"><span className="loading-spinner" /> Updating</span>}
          </div>
          {vehicles.length === 0 && !loadingData ? (
            <div className="admin-empty-state"><div aria-hidden="true">＋</div><h3>Your inventory starts here</h3><p>Add a vehicle to create its customer-facing listing.</p><button className="button button-red" type="button" onClick={() => setEditorOpen(true)}>Add your first vehicle</button></div>
          ) : (
            <div className="admin-listing-stack">
              {vehicles.map((vehicle) => (
                <article className="admin-listing-row" key={vehicle.id}>
                  <div className="admin-listing-thumb">
                    {vehicle.photos[0] ? (
                      <Image src={`/api/vehicle-images/${vehicle.photos[0].id}`} alt="" fill sizes="90px" className="admin-thumb-photo" />
                    ) : <span className="admin-thumb-empty">Photo<br />pending</span>}
                  </div>
                  <div className="admin-listing-details">
                    <div className="admin-listing-title-line">
                      <h3>{vehicleTitle(vehicle)}</h3>
                      <span className={`admin-status-pill${vehicle.status === "sold" ? " admin-status-sold" : ""}`}><i />{vehicle.status === "sold" ? "Sold" : "Available"}</span>
                    </div>
                    <p className="admin-listing-subline">{vehicle.configuration || vehicle.body || "Vehicle details"}{vehicle.engine ? ` · ${vehicle.engine} engine` : ""}{vehicle.price != null ? ` · ${money(vehicle.price)}` : ""}{vehicle.mileage != null ? ` · ${vehicle.mileage.toLocaleString("en-US")} mi` : ""}</p>
                    <code className="admin-vin">VIN&nbsp; {vehicle.vin}</code>
                  </div>
                  <div className="admin-listing-actions">
                    <button type="button" className="admin-action-link" onClick={() => { setEditingVehicle(vehicle); setEditorOpen(true); }}>Edit details</button>
                    <button type="button" className="admin-action-link" onClick={() => void changeStatus(vehicle)}>{vehicle.status === "sold" ? "Mark available" : "Mark sold"}</button>
                    <button type="button" className="admin-action-link admin-action-delete" onClick={() => void removeVehicle(vehicle)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section-card admin-messages-card">
          <div className="admin-section-heading">
            <div><span className="admin-eyebrow">CUSTOMER CONTACT</span><h2>Recent messages</h2></div>
            <a className="admin-view-email" href="mailto:info@missouricitymotorcars.com">Email dealership ↗</a>
          </div>
          {messages.length === 0 ? (
            <div className="admin-message-empty"><span aria-hidden="true">✉</span><p>New customer messages sent through the website will appear here.</p></div>
          ) : (
            <div className="admin-message-list">
              {messages.map((message) => (
                <article className="admin-message-item" key={message.id}>
                  <div className="admin-message-meta">
                    <div><h3>{message.name}</h3><a href={`mailto:${message.email}`}>{message.email}</a>{message.phone && <a href={`tel:${message.phone.replace(/[^\d+]/g, "")}`}>{message.phone}</a>}</div>
                    <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</time>
                  </div>
                  {message.vehicleSummary && <p className="admin-message-vehicle">About: {message.vehicleSummary}</p>}
                  <p className="admin-message-body">{message.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
        <p className="admin-footer-note">Your changes are saved to the dealership inventory. Public listings display only information entered here.</p>
      </div>
      {editorOpen && <VehicleEditor key={editingVehicle?.id ?? "new-vehicle"} vehicle={editingVehicle} onClose={() => { setEditorOpen(false); setEditingVehicle(null); }} onSave={saveVehicle} />}
    </main>
  );
}
