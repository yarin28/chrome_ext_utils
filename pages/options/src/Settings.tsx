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
import ResetSettingsButton from './ResetSettingsButton';

const SettingsManager = () => {
  // Hold your settings JSON in state.
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const editorRef = React.createRef();

  // On mount, load settings from chrome.storage (sync or local)
  useEffect(() => {
    chrome.storage.sync.get(['settings'], result => {
      // If settings exist, use them; otherwise, initialize with default values.
      if (result.settings) {
        setSettings(result.settings);
      } else {
        // Optionally, define your default settings here.
        // setSettings({
        //   theme: 'light',
        //   featureFlag: true,
        //   customOption: 'value',
        // });
      }
      setLoading(false);
    });
  }, []);

  // Update the local settings state when the JSON editor changes.
  const handleEditorChange = (updatedJson: any) => {
    setSettings(updatedJson);
  };

  const handleReset = (newSettings: any) => {
    setSettings(newSettings);
    editorRef.current.jsonEditor.set(newSettings);
  };
  // Save the updated settings back to chrome.storage.
  const handleSave = () => {
    chrome.storage.sync.set({ settings }, () => {
      console.log('Settings saved:', settings);
      // You might also show a notification or update a status message.
      toast.success('Settings saved');
    });
  };
  const setSettingsTest = () => {
    const testObjet = { dog: 'woff', cat: 'meow' };
    setSettings(testObjet);
    editorRef.current.jsonEditor.set(testObjet);
  };
  if (loading) return <div>Loading settings...</div>;

  return (
    <div style={{ padding: '1em' }}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        <AuroraText>Extension Options</AuroraText>
      </h1>
      {/* Render the JSON editor with your settings */}
      <Editor
        value={settings}
        onChange={handleEditorChange}
        ref={editorRef}
        ace={ace}
        mode="code"
        allowedModes={['code', 'tree', 'view', 'form', 'text']}
        theme="ace/theme/github"
      />
      <button onClick={handleSave} style={{ marginTop: '1em' }}>
        Save Settings
      </button>
      <Button onClick={setSettingsTest} variant="custom" style={{ marginTop: '1em' }}>
        setSettingsTest
      </Button>
      <ResetSettingsButton onReset={handleReset}></ResetSettingsButton>
      <Toaster richColors expand={true} />
    </div>
  );
};

export default SettingsManager;
