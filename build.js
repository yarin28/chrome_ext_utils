// build.js - A Node.js script to package your extension
import { readFileSync, writeFileSync } from 'fs';
import ChromeExtension from 'crx';
import { resolve } from 'path';

async function packageExtension() {
  // Initialize the ChromeExtension object
  const crx = new ChromeExtension({
    privateKey: readFileSync(resolve('key.pem')),
    codebase: 'https://github.com/yarin28/fast_login_ext/raw/refs/heads/main/fast_login_ext.crx',
    rootDirectory: resolve('./dist'),
  });

  try {
    // Pack all files from your extension directory
    const crxBuffer = await crx.pack();

    // Save the .crx file
    writeFileSync('fast_login_ext.crx', crxBuffer);

    // Generate and save the updates.xml
    const updateXML = await crx.generateUpdateXML();
    writeFileSync('updates.xml', updateXML);

    console.log('Extension packaged successfully!');
  } catch (err) {
    console.error('Error packaging extension:', err);
  }
}

packageExtension();
