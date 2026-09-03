import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Plus, CheckCircle2, AlertTriangle, FileText, ShieldAlert, X } from 'lucide-react';

/* ── Page title map ── */
const PAGE_TITLES = {
  '/hub':            { title: 'Enforcement Hub',        sub: 'Declaration extraction & compliance assessment' },
  '/new-inspection': { title: 'New Product Inspection', sub: 'Upload package images and run a compliance assessment' },
  '/history':        { title: 'Inspection Log',         sub: 'Review previous inspections and assessment outcomes' },
  '/reports':        { title: 'Statutory Reports',      sub: 'Official reports from completed inspection assessments' },
};

const getPageMeta = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/inspection/'))      return { title: 'Inspection Record',  sub: 'Compliance assessment result' };
  if (pathname.startsWith('/analysis-result/')) return { title: 'Assessment Result',  sub: 'AI-assisted inspection outcome' };
  if (pathname.startsWith('/report/'))          return { title: 'Inspection Report',  sub: 'Official statutory report' };
  return { title: 'PackGuard', sub: 'Legal Metrology Division' };
};

/* ── Static notification data (frontend-only, no backend) ── */
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: '#1B6B35',
    iconBg: '#EBF5EE',
    iconBorder: '#A8D5B5',
    title: 'Inspection analysis completed',
    desc: 'Assessment for INS-2026-2693 is ready for review.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: '#8A5C00',
    iconBg: '#FEF7EC',
    iconBorder: '#F0C878',
    title: 'Potential non-compliance flagged',
    desc: 'MRP declaration could not be detected on INS-2026-2693.',
    time: '4 min ago',
    read: false,
  },
  {
    id: 3,
    icon: FileText,
    iconColor: '#6D28D9',
    iconBg: '#F5F3FF',
    iconBorder: '#C4B5FD',
    title: 'Inspection report is ready',
    desc: 'REP-INS-2026-2693 has been generated and is available.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 4,
    icon: ShieldAlert,
    iconColor: '#6B6560',
    iconBg: '#F7F5F0',
    iconBorder: '#D4CFC8',
    title: 'Net quantity declaration review',
    desc: 'Net quantity requires inspector confirmation on last assessment.',
    time: '12 min ago',
    read: true,
  },
];

/* ── Notification dropdown component ── */
const NotificationPanel = ({ notifications, onMarkRead, onMarkAllRead, onClose }) => {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      width: '340px',
      backgroundColor: 'var(--pg-surface)',
      border: '1px solid var(--pg-border)',
      borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      zIndex: 200,
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--pg-navy)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell style={{ width: '13px', height: '13px', color: '#fff' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Notifications</span>
          {unread > 0 && (
            <span style={{
              fontSize: '10px', fontWeight: 700,
              backgroundColor: '#2C6E49', color: '#fff',
              borderRadius: '10px', padding: '1px 7px',
              lineHeight: '16px',
            }}>
              {unread} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                fontSize: '11px', fontWeight: 500,
                color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0, whiteSpace: 'nowrap',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '22px', height: '22px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '4px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <X style={{ width: '11px', height: '11px' }} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: '12.5px', color: 'var(--pg-text-muted)' }}>
            No notifications
          </div>
        ) : (
          notifications.map((n, idx) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '11px',
                  padding: '12px 16px',
                  borderBottom: idx < notifications.length - 1 ? '1px solid var(--pg-border)' : 'none',
                  backgroundColor: n.read ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = n.read ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)'; }}
              >
                {/* Icon */}
                <div style={{
                  width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                  backgroundColor: n.iconBg,
                  border: `1px solid ${n.iconBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <Icon style={{ width: '13px', height: '13px', color: n.iconColor }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px',
                  }}>
                    <p style={{
                      fontSize: '12.5px', fontWeight: n.read ? 500 : 600,
                      color: 'var(--pg-text-primary)',
                      margin: 0, lineHeight: 1.35,
                    }}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <div style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: 'var(--pg-accent)',
                        flexShrink: 0, marginTop: '4px',
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: '11.5px', color: 'var(--pg-text-muted)',
                    margin: '3px 0 0', lineHeight: 1.45,
                  }}>
                    {n.desc}
                  </p>
                  <span style={{ fontSize: '10.5px', color: 'var(--pg-border-strong)', marginTop: '4px', display: 'block' }}>
                    {n.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '9px 16px',
        borderTop: '1px solid var(--pg-border)',
        backgroundColor: 'var(--pg-surface-subtle)',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--pg-text-muted)' }}>
          Notifications are session-based and reset on reload.
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════ */

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm]       = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [bellOpen, setBellOpen]           = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const bellRef = useRef(null);
  const pageMeta = getPageMeta(location.pathname);
  const unreadCount = notifications.filter(n => !n.read).length;

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bellOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header style={{
      height: '58px',
      backgroundColor: 'var(--pg-header-bg)',
      borderBottom: '1px solid var(--pg-header-border)',
      padding: '0 24px 0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      flexShrink: 0,
    }}>
      {/* ── Page-aware title ── */}
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <h2 style={{
          fontSize: '13.5px', fontWeight: 700,
          color: 'var(--pg-text-primary)', letterSpacing: '-0.01em',
          lineHeight: 1.2, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {pageMeta.title}
        </h2>
        <p style={{
          fontSize: '10.5px', color: 'var(--pg-text-muted)', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {pageMeta.sub}
        </p>
      </div>

      {/* ── Right controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Search — ≥768px */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'none' }} className="pg-header-search">
          <Search style={{
            width: '12px', height: '12px',
            color: searchFocused ? 'var(--pg-accent)' : 'var(--pg-text-muted)',
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', transition: 'color 0.15s ease',
          }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search inspection or product…"
            style={{
              width: '220px',
              backgroundColor: 'var(--pg-surface-subtle)',
              border: `1px solid ${searchFocused ? 'var(--pg-accent)' : 'var(--pg-border)'}`,
              borderRadius: '6px', fontSize: '12px',
              color: 'var(--pg-text-primary)',
              padding: '6px 12px 6px 30px',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxShadow: searchFocused ? '0 0 0 2px var(--pg-accent-muted)' : 'none',
            }}
          />
        </form>
        <style>{`@media (min-width: 768px) { .pg-header-search { display: block !important; } }`}</style>

        {/* New Inspection */}
        {location.pathname !== '/new-inspection' && (
          <button
            onClick={() => navigate('/new-inspection')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'var(--pg-accent)', color: '#ffffff',
              fontSize: '12px', fontWeight: 600,
              padding: '7px 13px', borderRadius: '6px',
              border: 'none', cursor: 'pointer',
              transition: 'background-color 0.15s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
          >
            <Plus style={{ width: '12px', height: '12px' }} />
            <span>New Inspection</span>
          </button>
        )}

        {/* ── Notification Bell ── */}
        <div ref={bellRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setBellOpen(prev => !prev)}
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px',
              backgroundColor: bellOpen ? 'var(--pg-accent-muted)' : 'var(--pg-surface-subtle)',
              border: `1px solid ${bellOpen ? '#A8D5B5' : (unreadCount > 0 ? '#A8D5B5' : 'var(--pg-border)')}`,
              borderRadius: '6px',
              color: unreadCount > 0 ? 'var(--pg-accent)' : 'var(--pg-text-muted)',
              cursor: unreadCount > 0 || bellOpen ? 'pointer' : 'default',
              transition: 'border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (unreadCount > 0 || bellOpen) {
                e.currentTarget.style.borderColor = 'var(--pg-accent)';
                e.currentTarget.style.color = 'var(--pg-accent)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = bellOpen ? '#A8D5B5' : (unreadCount > 0 ? '#A8D5B5' : 'var(--pg-border)');
              e.currentTarget.style.color = unreadCount > 0 ? 'var(--pg-accent)' : 'var(--pg-text-muted)';
            }}
          >
            <Bell style={{ width: '13px', height: '13px' }} />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px',
                minWidth: '16px', height: '16px',
                backgroundColor: '#DC2626', color: '#fff',
                fontSize: '9px', fontWeight: 800, lineHeight: '16px',
                borderRadius: '8px', textAlign: 'center',
                padding: '0 4px',
                border: '1.5px solid var(--pg-header-bg)',
                pointerEvents: 'none',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {bellOpen && (
            <NotificationPanel
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onClose={() => setBellOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
