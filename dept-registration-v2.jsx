import { useState, useEffect } from "react";

// ============================================================
//  ⚙️  ตั้งค่า: ใส่ URL ของ Google Apps Script ที่ Deploy แล้ว
// ============================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
// ============================================================

const DEPARTMENTS = [
  { id: "1", name: "กลุ่มงานอำนวยการ", icon: "🏛️" },
  { id: "2", name: "กลุ่มงานวิชาการ", icon: "📚" },
  { id: "3", name: "กลุ่มงานแผนงานและงบประมาณ", icon: "📊" },
  { id: "4", name: "กลุ่มงานบริหารทรัพยากรบุคคล", icon: "👥" },
  { id: "5", name: "กลุ่มงานเทคโนโลยีสารสนเทศ", icon: "💻" },
  { id: "6", name: "กลุ่มงานพัสดุและการเงิน", icon: "💰" },
  { id: "7", name: "กลุ่มงานกฎหมายและนิติการ", icon: "⚖️" },
  { id: "8", name: "กลุ่มงานประชาสัมพันธ์", icon: "📣" },
];

// ---- API Functions ----
async function fetchRegistrations() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getAll`);
    const data = await res.json();
    if (data.status === "ok") return data.registrations; // { "1": {...}, "3": {...} }
    return {};
  } catch {
    return {};
  }
}

async function submitRegistration(deptId, deptName, formData) {
  const payload = { action: "submit", deptId, deptName, ...formData };
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.status === "ok";
}

// ---- Shared Styles ----
const font = "'Sarabun', sans-serif";
const fontHead = "'IBM Plex Sans Thai', sans-serif";
const bg = "#0d1117";
const surface = "#161b22";
const border = "#21262d";
const borderHover = "#30363d";
const textPrimary = "#e6edf3";
const textMuted = "#8b949e";
const green = "#2ea043";
const greenLight = "#3fb950";
const blue = "#58a6ff";
const red = "#f85149";

// ---- Sub-components ----
function Stat({ label, value, color }) {
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 16px", minWidth: 90 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SectionLabel({ text, dot }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: textMuted, letterSpacing: 0.5 }}>{text}</span>
    </div>
  );
}

function DeptCard({ dept, done, info, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={!done ? onClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: done ? bg : hover ? "#1c2128" : surface,
        border: `1px solid ${done ? "#1a3a1f" : hover ? blue : borderHover}`,
        borderRadius: 12, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: done ? "default" : "pointer",
        transition: "all 0.15s", opacity: done ? 0.75 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 24 }}>{dept.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: done ? textMuted : textPrimary }}>{dept.name}</div>
          {done && info && (
            <div style={{ fontSize: 12, color: greenLight, marginTop: 3 }}>{info.name} · {info.position}</div>
          )}
        </div>
      </div>
      {done
        ? <div style={{ background: "#1a3a1f", color: greenLight, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: `1px solid ${green}`, whiteSpace: "nowrap" }}>✓ เรียบร้อย</div>
        : <div style={{ color: blue, fontSize: 20 }}>›</div>}
    </div>
  );
}

// ---- Pages ----
function HomePage({ registrations, onSelect, loading }) {
  const pending = DEPARTMENTS.filter((d) => !registrations[d.id]);
  const done = DEPARTMENTS.filter((d) => registrations[d.id]);

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: font, paddingBottom: 60 }}>
      <div style={{ background: "linear-gradient(135deg, #1a2332, #0d1117)", borderBottom: `1px solid ${border}`, padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${green}, #1a7f37)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
            <div>
              <div style={{ fontSize: 11, color: textMuted, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>ระบบลงทะเบียน</div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: textPrimary, fontFamily: fontHead }}>ข้อมูลหัวหน้ากลุ่มงาน</h1>
            </div>
          </div>
          {loading ? (
            <div style={{ color: textMuted, fontSize: 13, marginTop: 16 }}>⏳ กำลังโหลดข้อมูลจาก Google Sheet...</div>
          ) : (
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <Stat label="หน่วยงานทั้งหมด" value={DEPARTMENTS.length} color={blue} />
              <Stat label="กรอกข้อมูลแล้ว" value={done.length} color={green} />
              <Stat label="รอดำเนินการ" value={pending.length} color="#d29922" />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 0" }}>
        {!loading && pending.length === 0 && done.length > 0 && (
          <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: greenLight, marginBottom: 6 }}>ครบถ้วนทุกหน่วยงาน!</div>
            <div style={{ color: textMuted, fontSize: 14 }}>ทุกหน่วยงานได้กรอกข้อมูลเรียบร้อยแล้ว</div>
          </div>
        )}

        {!loading && pending.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <SectionLabel text="เลือกหน่วยงานเพื่อกรอกข้อมูล" dot="#d29922" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pending.map((dept) => (
                <DeptCard key={dept.id} dept={dept} done={false} onClick={() => onSelect(dept)} />
              ))}
            </div>
          </section>
        )}

        {!loading && done.length > 0 && (
          <section>
            <SectionLabel text={`หน่วยงานที่กรอกข้อมูลแล้ว (${done.length})`} dot={green} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {done.map((dept) => (
                <DeptCard key={dept.id} dept={dept} done info={registrations[dept.id]} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FormPage({ dept, onSubmit, onBack }) {
  const [form, setForm] = useState({ name: "", position: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const fields = [
    { key: "name", label: "ชื่อ-นามสกุล", placeholder: "เช่น นายสมชาย ใจดี", required: true },
    { key: "position", label: "ตำแหน่ง", placeholder: "เช่น ผู้อำนวยการกลุ่ม", required: true },
    { key: "phone", label: "เบอร์โทรศัพท์", placeholder: "เช่น 081-234-5678", required: false },
    { key: "email", label: "อีเมล", placeholder: "เช่น name@example.com", required: false },
  ];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.position.trim()) e.position = "กรุณากรอกตำแหน่ง";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setApiError("");
    try {
      const ok = await submitRegistration(dept.id, dept.name, { ...form, submittedAt: new Date().toLocaleString("th-TH") });
      if (ok) {
        onSubmit({ ...form, submittedAt: new Date().toLocaleString("th-TH") });
      } else {
        setApiError("❌ บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setApiError("❌ เชื่อมต่อ Google Sheet ไม่ได้ กรุณาตรวจสอบ URL ใน APPS_SCRIPT_URL");
    }
    setSubmitting(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: font }}>
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "20px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: `1px solid ${borderHover}`, color: textMuted, padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: font }}>← กลับ</button>
          <div>
            <div style={{ fontSize: 11, color: textMuted, letterSpacing: 1 }}>กรอกข้อมูลหัวหน้ากลุ่มงาน</div>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: fontHead }}>{dept.icon} {dept.name}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 24px" }}>
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 28 }}>
          {fields.map(({ key, label, placeholder, required }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>
                {label} {required && <span style={{ color: red }}>*</span>}
              </label>
              <input
                value={form[key]}
                onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: undefined }); }}
                placeholder={placeholder}
                style={{
                  width: "100%", boxSizing: "border-box", background: bg,
                  border: `1px solid ${errors[key] ? red : borderHover}`,
                  borderRadius: 8, padding: "10px 14px", color: textPrimary, fontSize: 14,
                  outline: "none", fontFamily: font,
                }}
              />
              {errors[key] && <div style={{ fontSize: 12, color: red, marginTop: 5 }}>{errors[key]}</div>}
            </div>
          ))}

          {apiError && (
            <div style={{ background: "#2d1a1a", border: `1px solid ${red}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: red, marginBottom: 16 }}>
              {apiError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", padding: 12,
              background: submitting ? "#1a3a1f" : `linear-gradient(135deg, ${green}, #1a7f37)`,
              border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "wait" : "pointer", fontFamily: font, marginTop: 8,
            }}
          >
            {submitting ? "⏳ กำลังบันทึกไปยัง Google Sheet..." : "✓ บันทึกข้อมูล"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ dept, info, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${green}, #1a7f37)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>✓</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: greenLight, margin: "0 0 8px", fontFamily: fontHead }}>บันทึกข้อมูลเรียบร้อย!</h2>
        <p style={{ color: textMuted, fontSize: 14, marginBottom: 4 }}>{dept.icon} {dept.name}</p>
        <p style={{ color: textMuted, fontSize: 12, marginBottom: 28 }}>ข้อมูลถูกส่งไปยัง Google Sheet แล้ว</p>

        <div style={{ background: surface, border: `1px solid #1a3a1f`, borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 28 }}>
          {[["ชื่อ-นามสกุล", info.name], ["ตำแหน่ง", info.position], info.phone && ["เบอร์โทร", info.phone], info.email && ["อีเมล", info.email], ["เวลาบันทึก", info.submittedAt]].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${border}` }}>
              <span style={{ color: textMuted, fontSize: 13 }}>{k}</span>
              <span style={{ color: textPrimary, fontSize: 13, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={onBack} style={{ background: "#21262d", border: `1px solid ${borderHover}`, color: textPrimary, padding: "10px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: font }}>
          ← กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

// ---- Main App ----
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedDept, setSelectedDept] = useState(null);
  const [lastInfo, setLastInfo] = useState(null);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations().then((data) => { setRegistrations(data); setLoading(false); });
  }, []);

  async function handleSubmit(info) {
    const updated = { ...registrations, [selectedDept.id]: info };
    setRegistrations(updated);
    setLastInfo(info);
    setPage("success");
  }

  if (page === "form" && selectedDept) return <FormPage dept={selectedDept} onSubmit={handleSubmit} onBack={() => setPage("home")} />;
  if (page === "success" && selectedDept) return <SuccessPage dept={selectedDept} info={lastInfo} onBack={() => { setPage("home"); setSelectedDept(null); fetchRegistrations().then(setRegistrations); }} />;
  return <HomePage registrations={registrations} onSelect={(d) => { setSelectedDept(d); setPage("form"); }} loading={loading} />;
}
