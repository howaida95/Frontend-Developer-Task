import { Component } from 'react';
import ErrorFallback from '@shared/components/ErrorFallback/index.js';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Unhandled React error', error, info);
    window.dispatchEvent(
      new CustomEvent('riverside:react-error', { detail: { message: error.message } }),
    );
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError)
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.reset}
          lang={this.props.lang}
          as={this.props.fallbackAs}
        />
      );
    return this.props.children;
  }
}
