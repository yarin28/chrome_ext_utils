import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@extension/ui';
import { Label } from '@extension/ui';
import { Input } from '@extension/ui';
import { Textfit } from 'react-textfit';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { AgGridReact } from 'ag-grid-react';
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
// import { GridExample } from './GridExample';
import ButtonCellRenderer from './ButtonCellRenderer';
import BadgeArrRenderer from './BadgeArrRenderer';

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
  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<any>([]);
    const quickFilterText = '';
    const gridRef = useRef<AgGridReact>(null);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<any>([]);
    const fixedFields = ['name', 'role'];
    const mySpecialFunction = (rowData: any) => {
      console.log('Row clicked:', rowData);
      // Additional custom logic here
    };
    const onGridReady = useCallback((params: GridReadyEvent) => {
      console.log('onGridReady');
      const users = chrome.storage.sync.get(['users'], result => {
        console.log(result);
        setRowData(result.users);
      });

      // sendTableFetchMessage();
    }, []);
    useEffect(() => {
      const fixedCols = fixedFields.map(field => {
        return {
          field: field,
          headerName: field,
          sortable: true,
          filter: true,
        };
      });
      const authCol = { field: 'auth', headerName: 'Auth', cellRenderer: BadgeArrRenderer, flex: 1 };
      const customCols = {
        headerName: 'Custom Fields',
        flex: 2,
        cellRenderer: (params: any) => {
          // Get all keys on the user that are not in fixedFields
          const customKeys = Object.keys(params.data).filter(key => !fixedFields.includes(key));
          if (customKeys.length === 0) return null;
          return (
            <div>
              <Textfit mode="multi">
                {customKeys.map(key => (
                  <p key={key}>
                    <strong> {key}:</strong> {JSON.stringify(params.data[key])}
                  </p>
                ))}
              </Textfit>
            </div>
          );
        },
      };
      setColDefs([...fixedCols, authCol, customCols]);
      // setColDefs([
    }, []);
    useEffect(() => {}, []);
    const onRowClicked = useCallback((event: any) => {
      // event.event is the native click event
      const clickedElement = event.event.target;
      console.log(clickedElement.localName);
      // If the click came from a BUTTON or an element inside a BUTTON, do nothing.
      if (clickedElement.localName === 'button' || clickedElement.closest('button')) {
        return;
      }
      mySpecialFunction(event.data);
    }, []);
    const onFilterTextBoxChanged = useCallback((params: any) => {
      gridRef.current!.api.setGridOption(
        'quickFilterText',
        (document.getElementById('filter-text-box') as HTMLInputElement).value,
      );

      const displayedRowsCount = gridRef.current!.api.getDisplayedRowCount();
      console.log(displayedRowsCount);
      if (displayedRowsCount == 1) {
        console.log('only one row');
        const row = gridRef.current!.api.getDisplayedRowAtIndex(0);
        console.log(row);
        const keys = Object.keys(row.data);
        console.log(keys);
        const values = Object.values(row.data);
        console.log(values);
        const data = keys.map((key, index) => {
          return { key: key, value: values[index] };
        });
        console.log(data);
      }
    }, []);
    return (
      <div
        // define a height because the Data Grid will fill the size of the parent container
        style={{ height: 500, width: '100%' }}>
        <span>Quick Filter:</span>
        <input type="text" id="filter-text-box" placeholder="Filter..." onInput={onFilterTextBoxChanged} />
        {/* <GridExample></GridExample> */}
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          quickFilterText={quickFilterText}
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
          enableCellTextSelection={true}
        />
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
