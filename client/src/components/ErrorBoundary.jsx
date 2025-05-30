// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Bir hata oluştu. Lütfen sayfayı yenileyin.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;