import React from 'react';
import AdminLoginBackground from '../components/admin/AdminLoginBackground';
import AdminLoginForm from '../components/admin/AdminLoginForm';
import '../styles/admin-login.css';

const AdminLoginPage: React.FC = () => {
  return (
    <div className="admin-login-root min-h-screen flex items-center justify-center cosmic-nebula-bg admin-cosmic-bg">
      <AdminLoginBackground />
      <div className="admin-login-container w-full max-w-3xl px-6 py-10 relative z-20">
        <div className="flex flex-col items-center mb-8">
          <div className="admin-logo-wrapper mb-4">
            <img src="/lovable-uploads/sadhanaboard_logo.png" alt="SadhanaBoard" className="admin-logo" />
            <div className="admin-logo-ring pointer-events-none" />
          </div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Secure administrative access to SadhanaBoard</p>
        </div>

        <div className="admin-login-card card-3d">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;



