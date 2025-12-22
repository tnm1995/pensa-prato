
import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fix: Extending the imported Component class directly to ensure state and props properties are correctly recognized by the TypeScript compiler.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Initializing state property inherited from React.Component
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    // Fix: Correctly accessing inherited state property
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ef4444' }}>Ops, algo deu errado.</h1>
          <p style={{ color: '#6b7280' }}>Ocorreu um erro ao carregar a aplicação.</p>
          <pre style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#f3f4f6', 
            borderRadius: '0.5rem', 
            overflow: 'auto', 
            textAlign: 'left', 
            fontSize: '0.75rem',
            color: '#374151',
            border: '1px solid #e5e7eb'
          }}>
            {/* Fix: Accessing state.error for rendering error message */}
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    // Fix: Correctly accessing inherited props property for children
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
