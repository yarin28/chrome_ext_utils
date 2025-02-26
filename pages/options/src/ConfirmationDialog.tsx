import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@extension/ui';
import { Button } from '@extension/ui';

interface ConfirmationDialogProps {
  computeCondition: () => boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  buttonText: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  computeCondition,
  onAccept,
  onCancel,
  buttonText,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleButtonClick = (): void => {
    if (computeCondition()) {
      setOpen(true);
    } else {
      console.log('Condition not met');
      onAccept && onAccept();
      setOpen(false);
    }
  };

  const handleAccept = (): void => {
    onAccept && onAccept();
    setOpen(false);
  };

  const handleCancel = (): void => {
    onCancel && onCancel();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleButtonClick}>{buttonText}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleAccept}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
