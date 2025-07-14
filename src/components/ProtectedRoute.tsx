'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth désactivée pour le MVP
  return <>{children}</>;
};

export default ProtectedRoute; 