import { useEffect, useRef, useState } from 'react';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { AllCommunityModule, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from '@extension/ui';
import { Toaster } from '@extension/ui/lib/components/ui/sonner';
import { toast } from 'sonner';
import UserGrid from './UserGrid';

interface FormData {
  form: HTMLFormElement;
  usernameField: HTMLInputElement;
  passwordField: HTMLInputElement;
  hostname: string;
}
interface Credentials {
  username: string;
  password: string;
}

export default function App() {
  const theme = useStorage(exampleThemeStorage);
  const [showDialog, setShowDialog] = useState(false);
  const [env, setEnv] = useState<string>('');
  const [firstDialogShow, setFirstDialogShow] = useState(true);
  const [formData, setFormData] = useState<FormData | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const location = document.location.href;
    if (location.includes('qas')) {
      setEnv('qas');
    }
    if (location.includes('preprod')) {
      setEnv('preprod');
    }
    if (location.includes('dev')) {
      setEnv('dev');
    }
    if (location.includes('gw.erp')) {
      setEnv('prod');
    }
  }, []);
  const fillFromWithCredentials = (credentials: Credentials) => {
    if (!formData) {
      toast.error('could not find the form on the website');
      return;
    }
    formData.usernameField.value = credentials.username;
    formData.passwordField.value = credentials.password;

    const submitButton = formData.form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitButton) {
      (submitButton as HTMLElement).click();
    }
    //disconnect the observer to save resorces
    observerRef.current?.disconnect();
    observerRef.current = null;
  };

  useEffect(() => {
    const checkForLoginForm = () => {
      // If we already have form data, don't do anything
      if (formData) {
        return;
      }
      const loginForm = document.querySelector('.login-container');
      if (!loginForm) {
        toast.error('No login form found'); //TODO: Toast looks bad, not critical
        return;
      }
      toast.info('Found login form');
      const usernameField = loginForm.querySelector(
        'input[type="text"], input[type="email"], input[name="username"]',
      ) as HTMLInputElement | null;
      const passwordField = loginForm.querySelector('input[type="password"]') as HTMLInputElement | null;
      if (usernameField && passwordField && !showDialog) {
        setFormData({
          form: loginForm as HTMLFormElement,
          usernameField,
          passwordField,
          hostname: window.location.hostname,
        });
      }

      if (loginForm && !showDialog && firstDialogShow) {
        setFirstDialogShow(false);
        setShowDialog(true);
      }
    };
    // Check immediately on mount
    checkForLoginForm();

    // Set up observer to watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      checkForLoginForm();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [showDialog]);

  // onSelectCredential: (crediential: any) => void;
  // onSingleFilterResult: (crediential: any) => void;
  const onSelectCredential = (crediential: any) => {
    console.info('Selected credential', crediential);
    fillFromWithCredentials(crediential);
    setShowDialog(false);
  };
  const onSingleFilterResult = (crediential: any) => {
    console.info('selectd by Filtering by credential', crediential);
    fillFromWithCredentials(crediential);
    setShowDialog(false);
  };
  return (
    <>
      <div className="flex items-center justify-between gap-2 rounded bg-green-100 px-2 py-1">
        <div className="flex gap-1 text-green-500">
          Edit <strong className="text-green-700">pages/content-ui/src/app.tsx</strong> and save to reload.
        </div>
        <Button theme={theme} className="text-green-500" onClick={exampleThemeStorage.toggle}>
          Toggle Theme
        </Button>
        <Dialog
          open={showDialog}
          onOpenChange={(open: boolean) => {
            setShowDialog(open);
            // If dialog is closed without selecting credentials, stop observing
            if (!open) {
              observerRef.current?.disconnect();
            }
          }}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select User Test </DialogTitle>
              <DialogDescription>select user test from list, you can filter the each row.</DialogDescription>
            </DialogHeader>
            <UserGrid
              onSelectCredential={onSelectCredential}
              onSingleFilterResult={onSingleFilterResult}
              env={env}></UserGrid>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster richColors expand={true}></Toaster>
    </>
  );
}
