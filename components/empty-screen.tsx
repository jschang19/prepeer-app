import PrepeerConfig from '@/prepeer.config'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-4 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          { PrepeerConfig.chat.emptyScreen.title || 'Welcome!'}
        </h1>
        <p className="leading-normal text-muted-foreground">
        { PrepeerConfig.chat.emptyScreen.contents[0] || ''}
        </p>
        <p className="leading-normal text-muted-foreground">
        { PrepeerConfig.chat.emptyScreen.contents[1] || ''}
        </p>
        <p className="leading-normal text-muted-foreground">
        { PrepeerConfig.chat.emptyScreen.contents[2] || ''}
        </p>
      </div>
    </div>
  )
}
