import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building,
  UserCheck,
  Shield,
  Briefcase,
  Receipt,
  CreditCard,
  FileText,
  Sliders,
  Gauge,
  TrendingUp,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className="ams-sidebar">
      <div className="ams-sidebar-brand">
        <div className="ams-sidebar-logo">
          <Building size={18} />
        </div>
        <span className="ams-sidebar-title">AMS Portal</span>
      </div>

      <nav className="ams-sidebar-nav">
        <div className="ams-nav-section-title">Core</div>
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div className="ams-nav-section-title">Finance & Billing</div>
        <NavLink
          to={ROUTES.FINANCE_DASHBOARD}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <TrendingUp size={18} />
          <span>Finance Dashboard</span>
        </NavLink>

        <NavLink
          to={ROUTES.INVOICES}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <FileText size={18} />
          <span>Invoices</span>
        </NavLink>

        <NavLink
          to={ROUTES.PAYMENTS}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <CreditCard size={18} />
          <span>Payments</span>
        </NavLink>

        <NavLink
          to={ROUTES.RECEIPTS}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Receipt size={18} />
          <span>Receipts</span>
        </NavLink>

        <NavLink
          to={ROUTES.CHARGES}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Sliders size={18} />
          <span>Charge Rules</span>
        </NavLink>

        <NavLink
          to={ROUTES.UTILITIES}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Gauge size={18} />
          <span>Utility Metering</span>
        </NavLink>

        <div className="ams-nav-section-title">Community & Access</div>
        <NavLink
          to={ROUTES.RESIDENTS}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Users size={18} />
          <span>Residents</span>
        </NavLink>

        <NavLink
          to={ROUTES.OWNERS}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <UserCheck size={18} />
          <span>Owners</span>
        </NavLink>

        <NavLink
          to={ROUTES.STAFF}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Briefcase size={18} />
          <span>Staff</span>
        </NavLink>

        <div className="ams-nav-section-title">System</div>
        <NavLink
          to={ROUTES.USERS}
          className={({ isActive }) =>
            `ams-nav-item ${isActive ? 'ams-nav-item--active' : ''}`
          }
        >
          <Shield size={18} />
          <span>User Access</span>
        </NavLink>
      </nav>

      <div className="ams-sidebar-footer">
        <div>AMS Multi-Module v1.0</div>
        <div style={{ marginTop: '2px', color: 'rgba(255,255,255,0.7)' }}>
          Shared Architecture
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;