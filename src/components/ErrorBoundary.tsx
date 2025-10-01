import React from 'react';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: hook into error reporting pipeline (Sentry, etc.)
    // For now, log with a clear prefix
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred. Try refreshing the page or contact support if the problem persists.</p>
            <pre className="text-xs whitespace-pre-wrap bg-black/5 p-2 rounded">{String(this.state.error?.message)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
