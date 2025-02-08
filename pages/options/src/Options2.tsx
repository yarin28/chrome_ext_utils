// src/options/Options.jsx
import React, { useState, useEffect } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { Button } from '@extension/ui';
import { AuroraText } from '@extension/ui';
import { Toaster } from '@extension/ui/lib/components/ui/sonner';
import { toast } from 'sonner';
const Options = () => {
  // Hold your settings JSON in state.
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // On mount, load settings from chrome.storage (sync or local)
  useEffect(() => {
    chrome.storage.sync.get(['settings'], result => {
      // If settings exist, use them; otherwise, initialize with default values.
      console.log(result);
      if (result.settings) {
        console.log('settings from server be like', result.settings);
        setSettings(result.settings);
        console.log('Settings loaded', settings);
      } else {
        // Optionally, define your default settings here.
        setSettings({
          theme: 'light',
          featureFlag: true,
          customOption: 'value',
        });
        console.log('Settings initialized inside else', settings);
      }
      setLoading(false);
    });
  }, []);

  // Update the local settings state when the JSON editor changes.
  const handleEditorChange = (updatedJson: any) => {
    setSettings(updatedJson);
  };
  const handleReset = (newSettings: any) => {
    // setSettings(newSettings);
  };
  // Save the updated settings back to chrome.storage.
  const handleSave = () => {
    console.log('inisde handle save', settings);
    chrome.storage.sync.set({ settings }, () => {
      toast.success('Settings saved');
      console.log('Settings saved', settings);
    });
  };
  const setSettingsDumb = () => {
    setSettings({ dog: 'woff', cat: 'meow' });
    console.log('Settings saved', settings);
  };

  return (
    <div style={{ padding: '1em' }}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        <AuroraText>Extension Options</AuroraText>
      </h1>
      {/* Render the JSON editor with your settings */}
      <Editor
        value={settings}
        onChange={handleEditorChange}
        ace={ace}
        mode="code"
        allowedModes={['code', 'tree', 'view', 'form', 'text']}
        theme="ace/theme/github"
      />
      <Button onClick={handleSave} style={{ marginTop: '1em' }}>
        Save Settings
      </Button>
      <Button onClick={setSettingsDumb} variant="custom" style={{ marginTop: '1em' }}>
        setSettingsDumb
      </Button>
      {/* <ResetSettingsButton onReset={handleReset}></ResetSettingsButton> */}
      <Toaster richColors expand={true} />
    </div>
  );
};

export default Options;
