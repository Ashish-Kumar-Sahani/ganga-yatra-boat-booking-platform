import { useState } from "react";
import {
  Bell,
  Eye,
  ShieldAlert,
  Save,
  Moon,
} from "lucide-react";

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sosMute, setSosMute] = useState(false);
  const [autoFlagRenewal, setAutoFlagRenewal] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [safetyThreshold, setSafetyThreshold] = useState(80);

  const handleSaveSettings = () => {
    alert("Authority system settings saved locally!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-blue-950">Authority Settings</h1>
        <p className="text-slate-500">Configure safety check variables, alarm sounds, and layout themes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Nav menu */}
        <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm space-y-1.5 h-fit text-xs font-bold text-slate-600">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 bg-blue-50 text-blue-700">
            <ShieldAlert size={16} />
            Safety & Verification
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50">
            <Bell size={16} />
            System Notifications
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50">
            <Eye size={16} />
            Theme Preferences
          </button>
        </div>

        {/* Right Settings panel */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm md:col-span-2 space-y-6">
          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-blue-950 border-b pb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-blue-600" /> Safety Constraints
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Audit Pass Threshold Score ({safetyThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  className="w-full mt-2 cursor-pointer accent-blue-600"
                  value={safetyThreshold}
                  onChange={(e) => setSafetyThreshold(Number(e.target.value))}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Vessels scoring below this percentage during safety audits will trigger a failure compliance log.
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">Auto-flag Renewal Required</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automatically mark permits as renewal-required 15 days prior to expiration dates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded cursor-pointer accent-blue-600"
                  checked={autoFlagRenewal}
                  onChange={(e) => setAutoFlagRenewal(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-black text-blue-950 border-b pb-3 flex items-center gap-2">
              <Bell size={18} className="text-blue-600" /> Notifications & Sounds
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Official Email Warnings</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Receive weekly email digests of expired permits and open safety violations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded cursor-pointer accent-blue-600"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">SOS Siren Sound</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Play visual/audio alarm sound in browser when a live SOS emergency broadcast triggers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded cursor-pointer accent-blue-600"
                  checked={!sosMute}
                  onChange={(e) => setSosMute(!e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-black text-blue-950 border-b pb-3 flex items-center gap-2">
              <Moon size={18} className="text-blue-600" /> Theme Display
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Dark Interface Mode</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Adjust interface styling to match low-light dark color palettes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded cursor-pointer accent-blue-600"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold shadow transition"
            >
              <Save size={16} /> Save Settings Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
