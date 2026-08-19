export function ModuleHeader({ title, description, actions, ...props }: {
  title: string,
  description: string,
  actions?: React.JSX.Element,
  children: React.ReactNode,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {props.children}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {actions}
    </div>
  )
}