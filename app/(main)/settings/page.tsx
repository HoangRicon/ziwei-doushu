'use client';
// app/(main)/settings/page.tsx — User settings page
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Settings {
  defaultGender: string;
  defaultTheme: string;
  defaultShichen: number;
  sharePublic: boolean;
  aiInterpretation: boolean;
}

const SHICHEN_LABELS = [
  'Tử (23-1)', 'Sửu (1-3)', 'Dần (3-5)', 'Mão (5-7)', 'Thìn (7-9)', 'Tỵ (9-11)',
  'Ngọ (11-13)', 'Mùi (13-15)', 'Thân (15-17)', 'Dậu (17-19)', 'Tuất (19-21)', 'Hợi (21-23)',
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Partial<Settings>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setForm(data);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-page)' }}>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Cài đặt
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '15px' }}>
            Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Profile Section */}
        <section className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Hồ sơ
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="w-14 h-14 rounded-full" />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-bg)' }}>
                  <span style={{ fontSize: '22px', color: 'var(--accent)', fontWeight: 700 }}>
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                  {session?.user?.name ?? 'Người dùng'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{session?.user?.email}</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Hồ sơ được đồng bộ từ Google. Để thay đổi, cập nhật tài khoản Google của bạn.
            </p>
          </div>
        </section>

        {/* Default Preferences */}
        <section className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Tùy chỉnh mặc định
          </h2>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Giới tính mặc định
              </label>
              <div className="flex gap-3">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm((f) => ({ ...f, defaultGender: g }))}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: form.defaultGender === g ? 'var(--accent)' : 'transparent',
                      color: form.defaultGender === g ? '#fff' : 'var(--text-body)',
                      border: `1.5px solid ${form.defaultGender === g ? 'var(--accent)' : 'var(--border-med)'}`,
                    }}
                  >
                    {g === 'male' ? 'Nam' : 'Nữ'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Giờ sinh mặc định
              </label>
              <select
                value={form.defaultShichen ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, defaultShichen: parseInt(e.target.value) }))}
                className="input-luxury"
                style={{ maxWidth: '300px' }}
              >
                {SHICHEN_LABELS.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Chủ đề mặc định
              </label>
              <div className="flex gap-3">
                {[['dark', 'Tối'], ['light', 'Sáng'], ['system', 'Hệ thống']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, defaultTheme: val }))}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: form.defaultTheme === val ? 'var(--accent)' : 'transparent',
                      color: form.defaultTheme === val ? '#fff' : 'var(--text-body)',
                      border: `1.5px solid ${form.defaultTheme === val ? 'var(--accent)' : 'var(--border-med)'}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Chia sẻ công khai mặc định</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Lá số mới sẽ được đặt ở chế độ công khai</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, sharePublic: !f.sharePublic }))}
                className="relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer"
                style={{ background: form.sharePublic ? 'var(--accent)' : 'var(--bg-2)' }}
                role="switch"
                aria-checked={form.sharePublic}
              >
                <span
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: form.sharePublic ? '26px' : '4px' }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>AI giải đoán mặc định</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Bật AI giải đoán cho lá số mới</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, aiInterpretation: !f.aiInterpretation }))}
                className="relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer"
                style={{ background: form.aiInterpretation ? 'var(--accent)' : 'var(--bg-2)' }}
                role="switch"
                aria-checked={form.aiInterpretation}
              >
                <span
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: form.aiInterpretation ? '26px' : '4px' }}
                />
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: saved ? '#22C55E' : 'var(--accent)',
                  color: '#fff',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
              </button>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section className="card p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Quản lý tài khoản
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Xóa tài khoản</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                  Xóa tài khoản sẽ xóa vĩnh viễn tất cả lá số và dữ liệu của bạn. Không thể khôi phục.
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{
                  background: 'transparent',
                  color: '#EF4444',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
