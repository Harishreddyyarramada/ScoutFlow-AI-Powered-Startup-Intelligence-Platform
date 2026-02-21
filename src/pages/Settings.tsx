import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  User,
  Brain,
  Sliders,
  Palette,
  Database,
  Save,
} from "lucide-react";

/* ================= STORAGE KEY ================= */
const STORAGE_KEY = "scoutflow_settings";

export default function Settings() {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
  });

  const [aiSettings, setAiSettings] = useState({
    autoEnrich: true,
    model: "gemini-2.5-flash",
    temperature: 0.5,
  });

  const [scoreWeights, setScoreWeights] = useState({
    traction: 30,
    hiring: 20,
    funding: 25,
    technical: 15,
    market: 10,
  });

  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const totalWeight =
    scoreWeights.traction +
    scoreWeights.hiring +
    scoreWeights.funding +
    scoreWeights.technical +
    scoreWeights.market;

  /* ================= LOAD DATA ON PAGE OPEN ================= */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed.profile);
      setAiSettings(parsed.aiSettings);
      setScoreWeights(parsed.scoreWeights);
      setTheme(parsed.theme);
      applyTheme(parsed.theme);
    } else {
      // Default values if nothing saved
      setProfile({
        name: "John Deo",
        email: "john@scoutflow.com",
        organization: "ScoutFlow VC",
        role: "Analyst",
      });
    }
  }, []);

  /* ================= THEME LOGIC ================= */

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function applyTheme(selected: "light" | "dark" | "system") {
    const root = document.documentElement;

    if (selected === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", selected === "dark");
    }
  }

  /* ================= SAVE SETTINGS ================= */

  function handleSave() {
    const data = {
      profile,
      aiSettings,
      scoreWeights,
      theme,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert("Settings saved successfully ✅");
  }

  /* ================= EXPORT DATA ================= */

  function handleExportData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return alert("No data to export");

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scoutflow-settings.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  /* ================= CLEAR CACHE ================= */

  function handleClearCache() {
    localStorage.clear();
    alert("All cache cleared.");
    window.location.reload();
  }

  /* ================= DELETE ACCOUNT ================= */

  function handleDeleteAccount() {
  // Remove only settings data
  localStorage.removeItem(STORAGE_KEY);

  // Show confirmation
  alert("Account deleted successfully.");

  // Redirect to homepage
  navigate("/");

  // Scroll to top after navigation
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);
}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, AI preferences, and scoring system.
        </p>
      </div>

      {/* PROFILE */}
      <Section title="Profile" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField label="Full Name" value={profile.name}
            onChange={(v) => setProfile({ ...profile, name: v })} />
          <InputField label="Email" value={profile.email}
            onChange={(v) => setProfile({ ...profile, email: v })} />
          <InputField label="Organization" value={profile.organization}
            onChange={(v) => setProfile({ ...profile, organization: v })} />
          <InputField label="Role" value={profile.role}
            onChange={(v) => setProfile({ ...profile, role: v })} />
        </div>
      </Section>

      {/* AI SETTINGS */}
      <Section title="AI & Enrichment" icon={Brain}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-medium">Auto Enrich</p>
            <Switch
              checked={aiSettings.autoEnrich}
              onCheckedChange={(v) =>
                setAiSettings({ ...aiSettings, autoEnrich: v })
              }
            />
          </div>

          <div>
            <p className="font-medium mb-2">
              Temperature ({aiSettings.temperature})
            </p>
            <Slider
              defaultValue={[aiSettings.temperature * 100]}
              max={100}
              step={1}
              onValueChange={(v) =>
                setAiSettings({
                  ...aiSettings,
                  temperature: v[0] / 100,
                })
              }
            />
          </div>
        </div>
      </Section>

      {/* SCORE WEIGHTS */}
      <Section title="Scoring Weights" icon={Sliders}>
        <div className="space-y-6">
          {Object.entries(scoreWeights).map(([key, value]) => (
            <WeightSlider
              key={key}
              label={key}
              value={value}
              onChange={(v) =>
                setScoreWeights({ ...scoreWeights, [key]: v })
              }
            />
          ))}

          <div className="flex justify-between border-t pt-2">
            <span>Total Weight</span>
            <Badge variant={totalWeight === 100 ? "default" : "destructive"}>
              {totalWeight}%
            </Badge>
          </div>
        </div>
      </Section>

      {/* APPEARANCE */}
      <Section title="Appearance" icon={Palette}>
        <div className="flex gap-3">
          {["light", "dark", "system"].map((mode) => (
            <Button
              key={mode}
              variant={theme === mode ? "default" : "outline"}
              onClick={() =>
                setTheme(mode as "light" | "dark" | "system")
              }
            >
              {mode}
            </Button>
          ))}
        </div>
      </Section>

      {/* DATA MANAGEMENT */}
      <Section title="Data Management" icon={Database}>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportData}>
            Export Data
          </Button>
          <Button variant="outline" onClick={handleClearCache}>
            Clear Cache
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </Section>

      {/* SAVE */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function WeightSlider({ label, value, onChange }: any) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="capitalize">{label}</p>
        <span>{value}%</span>
      </div>
      <Slider
        defaultValue={[value]}
        max={100}
        step={1}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}