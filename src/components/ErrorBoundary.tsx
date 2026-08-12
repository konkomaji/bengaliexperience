import { Component, type ErrorInfo, type ReactNode } from "react";
import { BreakdownScreen } from "./BreakdownScreen";

/**
 * Last line of defence. A thrown render error would otherwise blank the page
 * entirely; this shows the themed breakdown screen instead and offers a way
 * back on the road.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[bengali-experience] render error", error, info.componentStack);
  }

  render() {
    if (this.state.error) return <BreakdownScreen detail={this.state.error.message} />;
    return this.props.children;
  }
}
