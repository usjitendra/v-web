import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children; 
  }
}

function DefaultErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      <h2 className="font-bold">Something went wrong</h2>
      <p className="mt-2">{error?.message}</p>
    </div>
  );
}