"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    const errorMessage = error.message?.toLowerCase() || ""
    if (
      errorMessage.includes("sender") ||
      errorMessage.includes("wallet") ||
      errorMessage.includes("provider") ||
      errorMessage.includes("no account exist")
    ) {
      // Suppress Farcaster wallet errors
      console.warn("[v0] Farcaster wallet not available - game will run in standalone mode")
      return { hasError: false }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    const errorMessage = error.message?.toLowerCase() || ""
    if (!errorMessage.includes("sender") && !errorMessage.includes("wallet") && !errorMessage.includes("provider")) {
      console.error("[v0] Error caught by boundary:", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-amber-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reload Game
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
