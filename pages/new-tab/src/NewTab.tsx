import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button } from '@extension/ui';
import { t } from '@extension/i18n';
import { AuroraText } from '@extension/ui';
import { Toaster } from '@extension/ui/lib/components/ui/sonner';
import { toast } from 'sonner';

const NewTab = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'new-tab/logo_horizontal.svg' : 'new-tab/logo_horizontal_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });
  // const { toast } = useToast();
  const testToast = () => {
    // toast({ title: "test1", description: "test", variant: "", duration: 5000, action: <Button>test</Button>, style: { backgroundColor: "#3DD68C" } });
    toast.success('event');
    console.log(t('hello', 'World'));
  };
  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
        Ship <AuroraText children={'kaka'} />
      </h1>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/new-tab/src/NewTab.tsx</code>
        </p>
        <h6>The color of this paragraph is defined using SASS.</h6>
        <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={theme}>
          {t('toggleTheme')}
        </Button>
        <Button className="mt-4" onClick={testToast} theme={theme}>
          test toast
        </Button>
      </header>
      <Toaster richColors expand={true}></Toaster>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>), <div> Error Occur </div>);
