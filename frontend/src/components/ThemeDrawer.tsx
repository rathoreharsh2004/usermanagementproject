import { useRef, useState } from "react";
import { Check, Palette, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { useTheme, type ThemePreset } from "../context/ThemeContext";

const presets: { id: ThemePreset; name: string; description: string; preview: string }[] = [
  { id: "ocean", name: "Ocean", description: "Clean corporate blue", preview: "#2563eb" },
  { id: "violet", name: "Violet", description: "Creative purple accent", preview: "#7c3aed" },
  { id: "emerald", name: "Emerald", description: "Fresh balanced green", preview: "#059669" },
  { id: "darcula", name: "Darcula", description: "Dark developer theme", preview: "#61afef" }
];

export function ThemeDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    preset,
    buttonColor,
    fontName,
    setPreset,
    setButtonColor,
    uploadFont,
    clearFont,
    resetTheme
  } = useTheme();

  const fileRef = useRef<HTMLInputElement>(null);
  const [fontError, setFontError] = useState("");
  const [loadingFont, setLoadingFont] = useState(false);

  if (!isOpen) return null;

  const handleFontUpload = async (file?: File) => {
    if (!file) return;
    setFontError("");
    setLoadingFont(true);
    try {
      await uploadFont(file);
    } catch (err) {
      setFontError(err instanceof Error ? err.message : "Failed to load font.");
    } finally {
      setLoadingFont(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="theme-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Palette size={18} />
            <div>
              <h3>Theme Engine</h3>
              <span>Customize interface & typography</span>
            </div>
          </div>
          <div className="drawer-actions">
            <button className="icon-button" onClick={resetTheme} title="Reset all to default">
              <RotateCcw size={16} />
            </button>
            <button className="icon-button" onClick={onClose} title="Close panel">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-content">
          {/* Preset Selector */}
          <section className="drawer-section">
            <label className="section-title">Color Presets</label>
            <p className="section-desc">Select a coordinated palette for background and accents.</p>
            <div className="preset-grid">
              {presets.map((item) => {
                const isSelected = preset === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`preset-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setPreset(item.id)}
                  >
                    <span className="preset-swatch" style={{ background: item.preview }} />
                    <div className="preset-info">
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                    </div>
                    {isSelected && <Check size={16} className="preset-check" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Button Color Override */}
          <section className="drawer-section">
            <label className="section-title">Button Color Override</label>
            <p className="section-desc">
              Override primary buttons independently of the active preset.
            </p>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-swatch-input"
                value={buttonColor || "#2563eb"}
                onChange={(e) => setButtonColor(e.target.value)}
                aria-label="Pick custom button color"
              />
              <div className="color-picker-details">
                <strong>{buttonColor ? buttonColor.toUpperCase() : "Using Preset Accent"}</strong>
                <small>{buttonColor ? "Custom override active" : "Default preset button color"}</small>
              </div>
              {buttonColor && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setButtonColor("")}
                >
                  Reset
                </button>
              )}
            </div>
          </section>

          {/* Custom Font Upload */}
          <section className="drawer-section">
            <label className="section-title">Custom Font (FontFace API)</label>
            <p className="section-desc">
              Upload a font file (.woff, .woff2, .ttf, .otf) to rehydrate app-wide.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".woff,.woff2,.ttf,.otf"
              hidden
              onChange={(e) => handleFontUpload(e.target.files?.[0])}
            />

            {fontName ? (
              <div className="active-font-box">
                <div>
                  <strong>Active Font:</strong>
                  <span>{fontName.replace(/^UserFont_/, "")}</span>
                </div>
                <button
                  type="button"
                  className="icon-button danger"
                  onClick={clearFont}
                  title="Remove custom font"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="upload-font-button"
                onClick={() => fileRef.current?.click()}
                disabled={loadingFont}
              >
                <Upload size={16} />
                {loadingFont ? "Loading font..." : "Choose font file"}
              </button>
            )}

            {fontError && <div className="error-text">{fontError}</div>}
          </section>
        </div>
      </aside>
    </div>
  );
}

