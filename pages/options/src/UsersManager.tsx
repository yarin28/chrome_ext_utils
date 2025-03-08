import { AgGridReact } from 'ag-grid-react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { User, UsersStorageType } from '@extension/shared';
import { generateRandomUsers } from './RandomUser';
import { Button } from '@extension/ui';
import React from 'react';
import { useStorage } from '@extension/shared';
import { usersStorage } from '@extension/storage';
import { ConfirmationDialog } from './ConfirmationDialog';

const UserManager = () => {
  const [users, setUsers] = useState<UsersStorageType | null>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const editorRef: Editor = React.createRef();

  useEffect(() => {
    usersStorage.get().then(response => {
      if (response) {
        console.log('response', response);
        setUsers(response);
        editorRef.current.jsonEditor.set(response);
      }
    });
  }, []);

  const handleEdit = (users: UsersStorageType) => {
    setUsers({ ...users });
    if (editorRef.current) {
      editorRef.current.jsonEditor.set({ ...users });
    }
    setShowEditor(true);
  };

  const handleSave = () => {
    console.log('inside handleSave, the vars are selected user and editData:', users);

    // if (!users) return;
    usersStorage.set(users);
    setShowEditor(false);
  };

  const handleAccept = (): void => {
    console.log('action accepted');
    // add your custom logic here
    // if (!users) return;
    handleSave();
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
    console.log('handleAddRandomUsers', newUsers);
    if (users === null) {
      setUsers({ qas: newUsers, preprod: newUsers });
      editorRef.current.jsonEditor.set({ qas: newUsers, preprod: newUsers });
      return;
    }
  };
  const exampleUsers = {
    qas: [
      {
        auth: [
          {
            id: '6631812156',
            name: 'OAuth',
          },
          {
            id: '9386139921',
            name: 'OAuth',
          },
          {
            id: '7202511661',
            name: 'OAuth',
          },
        ],
        customProp: 'Custom-n9l6r',
        id: 'd43c40db-6604-4eca-b8a3-7e7595140627',
        name: 'Emma Smith',
        org_unit: 'Marketing',
        projects: 1,
        role: 'editor',
      },
      {
        accessLevel: 3,
        auth: [
          {
            id: '4313340746',
            name: 'BasicAuth',
          },
          {
            id: '4082005150',
            name: 'TokenAuth',
          },
        ],
        customProp: 'Custom-l6rax',
        id: 'a47a3d12-2642-4d9b-8097-11d03e6ec6eb',
        name: 'Liam Johnson',
        projects: 3,
        role: 'viewer',
      },
      {
        auth: [
          {
            id: '1934518883',
            name: 'TokenAuth',
          },
          {
            id: '5015470766',
            name: 'OAuth',
          },
          {
            id: '7699177922',
            name: 'BasicAuth',
          },
        ],
        id: '97d51ec3-1ac7-4443-98d5-d8131dd673b0',
        lastLogin: '2025-02-23T21:55:41.786Z',
        name: 'Olivia Williams',
        role: 'admin',
        temporaryAccess: true,
      },
      {
        auth: [
          {
            id: '4147278184',
            name: 'BasicAuth',
          },
        ],
        customProp: 'Custom-q5ng4',
        id: '6cda98b6-b6e6-4258-861c-460c82c5d12c',
        name: 'Noah Brown',
        org_unit: 'Engineering',
        phoneExtension: '326',
        projects: 4,
        role: 'editor',
      },
      {
        auth: [
          {
            id: '3036868253',
            name: 'BasicAuth',
          },
          {
            id: '6390354560',
            name: 'BasicAuth',
          },
        ],
        id: 'bed888d1-ed8f-4a63-8b30-b8f72adf63c7',
        lastLogin: '2025-02-01T03:29:19.756Z',
        name: 'Ava Jones',
        org_unit: 'Engineering',
        role: 'editor',
        temporaryAccess: true,
      },
      {
        auth: [
          {
            id: '7205773497',
            name: 'SAML',
          },
        ],
        id: '019ebd98-fa20-4624-a621-2e96b97dfb12',
        name: 'William Garcia',
        projects: 4,
        role: 'viewer',
        temporaryAccess: true,
      },
      {
        auth: [
          {
            id: '5911246642',
            name: 'SAML',
          },
        ],
        id: 'ba7d0911-dbfe-4a12-88dd-155061c68913',
        name: 'Sophia Miller',
        org_unit: 'Marketing',
        phoneExtension: '112',
        role: 'admin',
      },
      {
        active: true,
        auth: [
          {
            id: '3391749196',
            name: 'SAML',
          },
          {
            id: '2516237330',
            name: 'BasicAuth',
          },
        ],
        customProp: 'Custom-sdnzx',
        id: '7e06b3d3-b475-4315-825f-7204c10b97ac',
        name: 'James Davis',
        org_unit: 'HR',
        role: 'viewer',
      },
      {
        auth: [
          {
            id: '4658704467',
            name: 'BasicAuth',
          },
          {
            id: '8898290862',
            name: 'SAML',
          },
          {
            id: '4786470697',
            name: 'OAuth',
          },
        ],
        customProp: 'Custom-tu8pw',
        id: '98958344-6f10-4c86-adf1-5259c17d216e',
        lastLogin: '2025-02-09T21:57:13.411Z',
        name: 'Isabella Rodriguez',
        org_unit: 'Sales',
        phoneExtension: '492',
        role: 'editor',
      },
      {
        auth: [
          {
            id: '2198342695',
            name: 'OAuth',
          },
          {
            id: '8635910471',
            name: 'BasicAuth',
          },
        ],
        customProp: 'Custom-7molr',
        id: '5b53000a-d36e-467f-bd33-312ed9850203',
        lastLogin: '2025-02-03T14:46:46.442Z',
        name: 'Oliver Martinez',
        org_unit: 'HR',
        role: 'admin',
      },
    ],
  };
  return (
    <div className="user-manager">
      <div className="editor-modal">
        <div className="json-view">
          <Editor
            ref={editorRef}
            // value={exampleUsers}
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
