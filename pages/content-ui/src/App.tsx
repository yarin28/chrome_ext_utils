import { useEffect } from 'react';
import { Button } from '@extension/ui';
import { Label } from '@extension/ui';
import { Input } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from '@extension/ui';

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-green-100 px-2 py-1">
      <div className="flex gap-1 text-green-500">
        Edit <strong className="text-green-700">pages/content-ui/src/app.tsx</strong> and save to reload.
      </div>
      <Button theme={theme} className="text-green-500" onClick={exampleThemeStorage.toggle}>
        Toggle Theme
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        {/* <DialogPortal container={document.getElementById("chrome-extension-boilerplate-react-vite-content-view-root")}> */}
        {/* <DialogPortal container={}> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
        {/* </DialogPortal> */}
      </Dialog>
    </div>
  );
}
