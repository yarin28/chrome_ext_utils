import { useEffect, useState } from 'react';
import { Button } from '@extension/ui';
import { Label } from '@extension/ui';
import { Input } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
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

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  ModuleRegistry.registerModules([AllCommunityModule]);
  useEffect(() => {
    console.log('content ui loaded');
  }, []);
  const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
      { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
      { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
      { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
      { field: 'make' },
      { field: 'model' },
      { field: 'price' },
      { field: 'electric' },
    ]);

    return (
      <div
        // define a height because the Data Grid will fill the size of the parent container
        style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    );
  };
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
          <Button>Edit Profile</Button>
        </DialogTrigger>
        {/* <DialogPortal container={document.getElementById("chrome-extension-boilerplate-react-vite-content-view-root")}> */}
        {/* <DialogPortal container={}> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <GridExample></GridExample>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
        {/* </DialogPortal> */}
      </Dialog>
    </div>
  );
}
