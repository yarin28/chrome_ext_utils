'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@extension/ui';
import { Button } from '@extension/ui';
import { defaultSettings } from './defaultSettings';
interface ResetSettingsButtonProps {
  onReset?: (newSettings: any) => void;
}
const ResetSettingsButton: React.FC<ResetSettingsButtonProps> = ({ onReset }) => {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    // Save default settings to chrome.storage.sync.
    chrome.storage.sync.set({ settings: defaultSettings }, () => {
      console.log('Settings reset to default.');
      // Optionally update the parent state.
      if (onReset) onReset(defaultSettings);
      // Close the dialog.
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">save Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Reset</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset all settings to default? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleReset}>
            Confirm Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetSettingsButton;
