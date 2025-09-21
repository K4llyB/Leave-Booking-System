import React from "react";
export default class ErrorBoundary extends React.Component<{children:React.ReactNode},{err?:any}>{
  state = { err: undefined };
  static getDerivedStateFromError(err:any){ return { err }; }
  render(){
    if (this.state.err) return (
      <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-300 rounded text-red-800">
        <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
        <pre className="text-xs overflow-auto">{String(this.state.err)}</pre>
      </div>
    );
    return this.props.children;
  }
}
