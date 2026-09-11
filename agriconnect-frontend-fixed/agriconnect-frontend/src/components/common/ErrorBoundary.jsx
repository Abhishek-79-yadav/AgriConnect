import { Component } from "react";

/**
 * Catches render-time errors anywhere below it in the tree and shows a
 * recovery screen instead of an unstyled blank page. This only catches
 * errors thrown during rendering/lifecycle methods — it does NOT catch
 * errors inside async code or event handlers (those should be handled
 * where they occur, e.g. the axios interceptor for API errors).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Swap this for a real error-reporting service (Sentry, etc.) before
    // launch — logging to console is a placeholder so failures aren't
    // silent during development.
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1>Something went wrong</h1>
          <p>
            We hit an unexpected error. Try reloading the page — if it
            keeps happening, please contact support.
          </p>
          <button onClick={this.handleReload}>Back to Home</button>
        </div>
      );
    }

    return this.props.children;
  }
}
