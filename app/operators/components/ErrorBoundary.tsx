"use client";

import React, { Component, ReactNode } from "react";
import { PanelError } from "./PanelStates";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error in panel:", error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return <PanelError error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
