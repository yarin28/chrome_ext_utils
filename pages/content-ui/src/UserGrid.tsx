import { useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ProjectBadgeCellRenderer } from './AuthBadgeRenderer';
import { JsonCellRenderer } from './JsonCellRenderer';
import { Input } from '@extension/ui';
import { fetchUsers, fetchUsersInit } from '@extension/shared/lib/utils';
import { usersStorage } from '@extension/storage';
interface UserGridProps {
  onSelectCredential: (crediential: any) => void;
  onSingleFilterResult: (crediential: any) => void;
  env: string;
}
const UserGrid: React.FC<UserGridProps> = ({ onSelectCredential, onSingleFilterResult, env }) => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<any>([]);
  const quickFilterText = '';
  const gridRef = useRef<AgGridReact>(null);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<any>([]);
  const fixedFields = ['name', 'role'];
  const mySpecialFunction = (rowData: any) => {
    // Additional custom logic here
  };
  //register for the grid
  ModuleRegistry.registerModules([AllCommunityModule]);
  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    // const key: keyof User[] = env;
    const users = await usersStorage.get();
    console.log('env', env);
    console.log('users', users);
    if (users === null || users[env] == undefined || users[env].length === 0) {
      console.log('inside if');
      fetchUsersInit();
      fetchUsers(env);
    } else {
      setRowData(users[env]);
    }
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
    const colFilterParams = {
      textFormatter: (params: any) => {
        let returnString = '';
        if (params.value === undefined) {
          returnString = params;
        } else {
          returnString = params.value; // already a string using the value formatter inside the colDef
        }
        return returnString;
      },
    };
    const authCol = {
      field: 'auth',
      headerName: 'Auth',
      cellRenderer: ProjectBadgeCellRenderer,
      getQuickFilterText: (params: any) => {
        const authString = JSON.stringify(params.data.auth);
        return authString;
      },
      filterParams: colFilterParams,
      valueFormatter: (params: any) => {
        let returnString = '';
        if (params.value === undefined) {
          returnString = JSON.stringify(params.data);
        } else {
          returnString = JSON.stringify(params.value);
        }
        return returnString;
      },
      flex: 1,
      autoHeight: true,
      cellClassRules: {
        'no-row-click': () => true,
      },
    };
    const customCols = {
      headerName: 'Custom Fields',
      flex: 2,
      filterParams: colFilterParams,

      getQuickFilterText: (params: any) => {
        // const authString = Array.isArray(params.data.auth) ? params.data.auth.join(" ") : params.data.auth;
        const customKeys = Object.keys(params.data).filter(key => !fixedFields.includes(key));
        const values = JSON.stringify(customKeys.map(key => `${key} ${params.data[key]}`));
        return values;
      },
      // valueFormatter: (params: any) => {
      //   let returnString = '';
      //   if (params.value === undefined) {
      //     returnString = JSON.stringify(params.data);
      //   } else {
      //     returnString = JSON.stringify(params.value);
      //     // returnString = params.value
      //   }
      //   return returnString;
      // },
      // cellRenderer: (params: any) => {
      //   // Get all keys on the user that are not in fixedFields
      //   const customKeys = Object.keys(params.data).filter(key => !fixedFields.includes(key));
      //   if (customKeys.length === 0) return null;
      //   return (
      //     <div style={{ display: 'flex' }}>
      //       {/* <Textfit mode="multi"> */}
      //       {customKeys.map(key => (
      //         <div key={key}>
      //           <strong> {key}:</strong> {JSON.stringify(params.data[key])}
      //         </div>
      //       ))}
      //       {/* </Textfit> */}
      //     </div>
      //   );
      // },
      cellRenderer: JsonCellRenderer,
    };
    setColDefs([...fixedCols, authCol, customCols]);
    // setColDefs([
  }, []);
  const onRowClicked = useCallback((event: any) => {
    // event.event is the native click event
    const clickedElement = event.event.target;
    console.log(event);
    // If the click came from a BUTTON or an element inside a BUTTON, do nothing.
    if (clickedElement.localName === 'button' || clickedElement.closest('button')) {
      return;
    }
    // event.eventPath.forEach((element: any) => {
    //   console.log("element ", element, " ement.className ", element.className);
    //   if (element.className.includes("no-row-click")) {
    //     return;
    //   }
    // });
    for (let i = 0; i < event.eventPath.length; i++) {
      if (event.eventPath[i].className !== null && event.eventPath[i].className?.includes('no-row-click')) {
        return;
      }
    }
    onSelectCredential({ username: event.data.name, password: event.data.role });
  }, []);
  const onFilterTextBoxChanged = useCallback((params: any) => {
    gridRef.current!.api.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    );

    const displayedRowsCount = gridRef.current!.api.getDisplayedRowCount();
    if (displayedRowsCount == 1) {
      const row = gridRef.current!.api.getDisplayedRowAtIndex(0);
      if (row) {
        onSingleFilterResult({ username: row.data.name, password: row.data.role });
      }
    }
  }, []);
  return (
    <div
      // define a height because the Data Grid will fill the size of the parent container
      style={{ height: 500, width: '100%' }}>
      <span>Quick Filter:</span>
      <Input type="text" id="filter-text-box" placeholder="Filter..." onInput={onFilterTextBoxChanged} />
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
export default UserGrid;
