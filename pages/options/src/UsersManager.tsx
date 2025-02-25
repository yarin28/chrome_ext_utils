import { AgGridReact } from 'ag-grid-react';
import { JsonEditor as Editor } from 'jsoneditor-react';
// import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
// If using community features (sorting, filtering, etc.)
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ValidationModule,
  RowSelectionModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  TextFilterModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  RowSelectionModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  TextFilterModule,
]);
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { User } from '@extension/shared';
import { generateRandomUsers } from './RandomUser';
import { Button } from '@extension/ui';
import React from 'react';
import { useStorage } from '@extension/shared';
import { usersStorage } from '@extension/storage';
const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const editorRef: Editor = React.createRef();

  useEffect(() => {
    usersStorage.get().then(users => {
      if (users) {
        setUsers(users);
        editorRef.current.jsonEditor.set(users);
      }
    });
  }, []);

  // Ag-Grid configuration
  const columnDefs = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'role', headerName: 'Role', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <button className="edit-btn" onClick={() => handleEdit(params.data)}>
          Edit
        </button>
      ),
    },
  ];

  const defaultColDef = {
    flex: 1,
    resizable: true,
  };

  const handleEdit = (users: User[]) => {
    setUsers({ ...users });
    if (editorRef.current) {
      editorRef.current.jsonEditor.set({ ...users });
    }
    setShowEditor(true);
  };

  const handleSave = async () => {
    console.log('inside handleSave, the vars are selected user and editData:', selectedUser, users);

    if (!users) return;
    usersStorage.set(users);
    setShowEditor(false);
  };

  const handleJsonChange = (json: any) => {
    console.log('json:', json);
    setUsers(json);
  };
  const handleAddRandomUsers = async () => {
    const newUsers = generateRandomUsers(10);
    console.log(newUsers);
    const updatedUsers = [...users, ...newUsers];
    setUsers(updatedUsers);
    editorRef.current.jsonEditor.set(updatedUsers);
  };
  return (
    <div className="user-manager">
      <Button onClick={handleAddRandomUsers} variant="custom">
        Add Random Users
      </Button>

      <div className="editor-modal">
        <div className="json-view">
          <Editor
            ref={editorRef}
            value={users}
            onChange={handleJsonChange}
            ace={ace}
            mode="code"
            history={true}
            navigationBar={false}
            statusBar={false}
            style={{ height: '400px' }}
          />
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
