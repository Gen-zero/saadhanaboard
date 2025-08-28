import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSelection } from '@/components/RoleSelection';
import { UserRole } from '@/hooks/useUserRole';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelected = (role: UserRole) => {
    // Navigate to the main app after role selection
    navigate('/sadhana');
  };

  return <RoleSelection onRoleSelected={handleRoleSelected} />;
};

export default RoleSelectionPage;