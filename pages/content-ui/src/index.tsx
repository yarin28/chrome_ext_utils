import { createRoot } from 'react-dom/client';
import App from '@src/App';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';
import '@extension/ui/dist/global.css';

function main() {
  // should mount the react
  console.log(document.location.href);
  if (
    !(
      document.location.href.includes('gw.qas.erp') ||
      document.location.href.includes('gw.qas.erp') ||
      document.location.href.includes('gw.preprod.erp') ||
      document.location.href.includes('gw.dev.erp') ||
      document.location.href.includes('preprod') ||
      document.location.href.includes('qas')
    )
  ) {
    return;
  }

  const root = document.createElement('div');
  root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

  document.body.append(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  const shadowRoot = root.attachShadow({ mode: 'open' });

  if (navigator.userAgent.includes('Firefox')) {
    /**
     * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
     * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
     *
     * Injecting styles into the document, this may cause style conflicts with the host page
     */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = tailwindcssOutput;
    shadowRoot.appendChild(styleElement);
  } else {
    /** Inject styles into shadow dom */
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(tailwindcssOutput);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }

  shadowRoot.appendChild(rootIntoShadow);
  createRoot(rootIntoShadow).render(<App />);

  // FIXME: this is a test to see
  // if globalStyleSheet will fix the dialog

  // In your content script entry file (e.g., `src/content-ui/index.tsx`)

  // Inject styles into the page's <head>
  const styleTag = document.createElement('style');
  styleTag.textContent = tailwindcssOutput;
  document.head.appendChild(styleTag);
}
main();
