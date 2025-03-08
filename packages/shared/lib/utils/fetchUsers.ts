import { useStorage } from '../hooks/useStorage';
import { usersStorage } from '@extension/storage';
import { User } from './shared-types';
let settings: any = {};
chrome.storage.sync.get(['settings'], result => {
  // If settings exist, use them; otherwise, initialize with default values.
  if (result.settings) {
    settings = result.settings;
  } else {
    // Optionally, define your default settings here.
    // setSettings({
    //   theme: 'light',
    //   featureFlag: true,
    //   customOption: 'value',
    // });
  }
});

export const fetchUsersInit = () => {
  tableFetchResponseListner();
};
export const fetchUsers = async (env: string) => {
  sendTableFetchMessage(env);
};

const tableFetchResponseListner = () => {
  console.log('tableFetchResponseListener');
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const response = message;
    const env = message.env;
    console.log('message.env', message.env);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.html, 'text/html');
    const targetTable = doc.getElementById(settings.TABLE_ID) as HTMLTableElement;
    console.log(targetTable);
    if (targetTable) {
      const headerRow = targetTable.rows[0];
      const headers: any = Array.from(headerRow.cells).map(cell => {
        if (cell.textContent === null) return;
        return cell.textContent.trim();
      });
      const data = [];
      const users: User[] = [];
      for (let i = 1; i < targetTable.rows.length; i++) {
        const row = targetTable.rows[i];
        const rowData: { [key: string]: string } = {};
        Array.from(row.cells).forEach((cell, index: any) => {
          if (cell.textContent === null) return;
          rowData[headers[index]] = cell.textContent.trim();
        });
        data.push(rowData);
        const user: User = {
          name: rowData.Contact,
          role: rowData.Company,
          id: i.toString(),
          ...rowData,
        };
        users.push(user);
      }
      console.log('added users from fetchUsers to storage', users);
      const currentUsers = await usersStorage.get();
      if (currentUsers === null) {
        usersStorage.set({ [env]: users });
      } else {
        currentUsers[env] = users;
        usersStorage.set(currentUsers);
      }
    }
  });
};

export const sendTableFetchMessage = async (env: string) => {
  console.log('enterd sendTableFetchMessage');
  try {
    return await chrome.runtime.sendMessage({
      action: 'fetchTable',
      url: settings['TABLE_URLS'][env],
      env: env,
    });
  } catch (error: any) {
    throw new Error('Failed to send message to fetch the table: ' + error.message);
  }
};
