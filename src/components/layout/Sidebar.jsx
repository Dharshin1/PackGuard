import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  FileCheck,
  Scale
} from 'lucide-react';

const Sidebar = () => {
  const sections = [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Enforcement Hub', path: '/hub', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INSPECTIONS',
      items: [
        { label: 'New Product Inspection', path: '/new-inspection', icon: PlusCircle },
        { label: 'Inspection Log', path: '/history', icon: History }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Statutory Reports', path: '/reports', icon: FileCheck }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: '224px',
        backgroundColor: 'var(--pg-nav-bg)',
        borderRight: '1px solid var(--pg-nav-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Brand */}
      <div style={{
        padding: '18px 16px 16px',
        borderBottom: '1px solid var(--pg-nav-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '11px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: 'var(--pg-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Scale style={{ width: '16px', height: '16px', color: '#ffffff' }} />
        </div>
        <div>
          <div style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}>
            Pack<span style={{ color: '#4ade80' }}>Guard</span>
          </div>
          <div style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--pg-nav-text)',
            marginTop: '2px',
            opacity: 0.7,
          }}>
            Legal Metrology Division
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <div style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--pg-nav-text)',
              opacity: 0.45,
              padding: '0 8px',
              marginBottom: '5px',
            }}>
              {section.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/hub'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      color: isActive ? '#ffffff' : 'var(--pg-nav-text)',
                      backgroundColor: isActive ? 'var(--pg-nav-active-bg)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--pg-accent)' : '3px solid transparent',
                      paddingLeft: isActive ? '9px' : '9px',
                      transition: 'color 0.12s ease, background-color 0.12s ease',
                    })}
                    onMouseEnter={e => {
                      const isA = e.currentTarget.style.backgroundColor !== 'transparent';
                      if (!isA) {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={e => {
                      const isA = e.currentTarget.getAttribute('aria-current') === 'page';
                      if (!isA) {
                        e.currentTarget.style.color = 'var(--pg-nav-text)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Badge */}
      <div style={{
        margin: '10px',
        padding: '11px 13px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--pg-nav-border)',
        borderRadius: '6px',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', opacity: 0.6, display: 'block', marginBottom: '2px' }}>
          Dept. of Consumer Affairs
        </span>
        <span style={{ fontSize: '10px', color: 'var(--pg-nav-text)', opacity: 0.7, lineHeight: 1.4, display: 'block' }}>
          Legal Metrology Rules 2011
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
