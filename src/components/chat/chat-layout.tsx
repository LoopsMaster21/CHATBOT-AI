import {type ReactNode} from 'react';

export default function ChatLayout({children}: {children: ReactNode}) {
  return (
    <div className="relative flex h-full w-full max-w-4xl flex-col rounded-lg border bg-white shadow-lg dark:bg-card">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              S
            </div>
            <h1 className="text-lg font-bold">Spinneys ChatAssist</h1>
        </div>
      </header>
      {children}
    </div>
  );
}
