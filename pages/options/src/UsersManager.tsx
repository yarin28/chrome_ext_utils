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
import { User } from './types';
import { generateRandomUsers } from './RandomUser';
import { Button } from '@extension/ui';
import React from 'react';
const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const editorRef = React.createRef();

  // Load users from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(['users'], result => {
      if (result.users) {
        setUsers(result.users);
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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditData({ ...user });
    if (editorRef.current) {
      editorRef.current.jsonEditor.set({ ...user });
    }
    setShowEditor(true);
  };

  const handleSave = async () => {
    console.log('inside handleSave, the vars are selected user and editData:', selectedUser, editData);

    if (!selectedUser || !editData) return;

    const updatedUsers = users.map(user => (user.id === selectedUser.id ? { ...editData, id: user.id } : user));

    chrome.storage.sync.set({ updatedUsers }, () => {
      console.log('Users saved:', updatedUsers);
    });
    setUsers(updatedUsers);
    setShowEditor(false);
  };

  const handleJsonChange = (json: any) => {
    console.log('json:', json);
    setEditData(json);
  };
  const handleAddRandomUsers = async () => {
    const newUsers = generateRandomUsers(10);
    const updatedUsers = [...users, ...newUsers];
    setUsers(updatedUsers);
  };
  return (
    <div className="user-manager">
      <Button onClick={handleAddRandomUsers} variant="custom">
        Add Random Users
      </Button>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          onGridReady={params => params.api.sizeColumnsToFit()}
        />
      </div>

      {showEditor && (
        <div className="editor-modal">
          <div className="mode-toggle">
            <button onClick={() => setViewMode('form')}>Form View</button>
            <button onClick={() => setViewMode('json')}>JSON View</button>
          </div>

          {viewMode === 'form' ? (
            <div className="form-view">
              <label>
                Name:
                <input
                  value={editData?.name || ''}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Role:
                <select value={editData?.role || ''} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>

              <div className="custom-fields">
                <h4>Additional Properties</h4>
                {Object.keys(editData)
                  .filter(key => !['id', 'name', 'role'].includes(key))
                  .map(key => (
                    <div key={key} className="custom-field">
                      <input
                        value={key}
                        onChange={e => {
                          const newData = { ...editData };
                          const value = newData[key];
                          delete newData[key];
                          newData[e.target.value] = value;
                          setEditData(newData);
                        }}
                      />
                      <input
                        value={editData[key]}
                        onChange={e =>
                          setEditData({
                            ...editData,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                <button onClick={() => setEditData({ ...editData, newProperty: '' })}>+ Add Property</button>
              </div>
            </div>
          ) : (
            <div className="json-view">
              <Editor
                ref={editorRef}
                value={editData}
                onChange={handleJsonChange}
                ace={ace}
                mode="code"
                history={true}
                navigationBar={false}
                statusBar={false}
                style={{ height: '400px' }}
              />
            </div>
          )}

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
