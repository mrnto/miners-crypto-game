import { useState } from 'react';

export const useSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return { isSidebarOpen, toggleSidebar };
};