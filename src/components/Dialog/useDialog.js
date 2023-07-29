import { useState } from 'react';

export const useDialog = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(!isDialogOpen);

  return { isDialogOpen, openDialog };
};