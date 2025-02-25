import { useEffect } from 'react';
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
import UserGrid from './UserGrid';
export default function App() {
  const theme = useStorage(exampleThemeStorage);
  //TODO: move the settings object to some storage place
  const SETTINGS = {
    TABLE_URLS: {
      qas: 'https://www.w3schools.com/html/html_tables.asp',
      preprod: 'https://www.w3schools.com/html/html_tables.asp',
    },
    TABLE_ID: 'customers',
    TITLE_COLORS: {
      qas: '#00FF00',
      preprod: '#bd24eb',
    },
    STORAGE_KEY: 'loginCredentials',
  };
  ModuleRegistry.registerModules([AllCommunityModule]);
  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-green-100 px-2 py-1">
      <div className="flex gap-1 text-green-500">
        Edit <strong className="text-green-700">pages/content-ui/src/app.tsx</strong> and save to reload.
      </div>
      <Button theme={theme} className="text-green-500" onClick={exampleThemeStorage.toggle}>
        Toggle Theme
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        {/* <DialogPortal container={document.getElementById("chrome-extension-boilerplate-react-vite-content-view-root")}> */}
        {/* <DialogPortal container={}> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <UserGrid></UserGrid>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
        {/* </DialogPortal> */}
      </Dialog>
    </div>
  );
}
