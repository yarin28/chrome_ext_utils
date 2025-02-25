import { useStorage } from '../hooks/useStorage';
import { usersStorage } from '@extension/storage';
import { User } from './shared-types';
let settings = {};
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
function add_users_to_users_object_from_table() {
  const users: any = [];
  doc.querySelectorAll('#customers tbody tr').forEach(row => {
    const cells = row.cells;
    const user = {
      username: cells[0].innerText,
      password: cells[1].innerText,
      description: cells[2].innerText,
    };
    users.push(user);
    console.log(user);
  });
  usersStorage.set(users);
}
const sendMessageToFetchTable = async (targetUrl: string) => {
  try {
    return await chrome.runtime.sendMessage({
      action: 'fetchTable',
      url: targetUrl,
    });
  } catch (error: any) {
    throw new Error('Failed to fetch table: ' + error.message);
  }
};
