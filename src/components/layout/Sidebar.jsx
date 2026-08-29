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
        { label: 'Enforcement Hub', path: '/', icon: LayoutDashboard }
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
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 shrink-0 select-none">
      {/* Brand Header: Purple rounded-square logo + White/Purple PackSure text */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide leading-none">
            Pack<span className="text-indigo-400">Sure</span>
          </h1>
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-1">
            LEGAL METROLOGY DIVISION
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Official Division Badge */}
      <div className="p-4 m-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-normal">
        <span className="font-bold text-slate-300 block mb-0.5">Department of Consumer Affairs</span>
        Legal Metrology Rules 2011 Standard
      </div>
    </aside>
  );
};

export default Sidebar;
