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
import { ConfirmationDialog } from './ConfirmationDialog';

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

  const handleEdit = (users: User[]) => {
    setUsers({ ...users });
    if (editorRef.current) {
      editorRef.current.jsonEditor.set({ ...users });
    }
    setShowEditor(true);
  };

  const handleSave = async () => {
    console.log('inside handleSave, the vars are selected user and editData:', users);

    if (!users) return;
    usersStorage.set(users);
    setShowEditor(false);
  };

  const handleAccept = (): void => {
    console.log('Action confirmed!');
    // add your custom logic here
    usersStorage.set(users);
  };

  const handleCancel = (): void => {
    console.log('Action cancelled!');
    // add your custom logic here
  };
  const computeCondition = () => {
    if (!users) return true;
    else return false;
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
            htmlElementProps={{ style: { height: '90vh' } }}
          />
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            Cancel
          </Button>
          <ConfirmationDialog
            buttonText="Save"
            onAccept={handleAccept}
            onCancel={handleCancel}
            computeCondition={computeCondition}
          />
          <Button onClick={handleAddRandomUsers} variant="custom">
            Add Random Users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
