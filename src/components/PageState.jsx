
export function PageState({ loading, error, onRetry }) {
  if (loading)
    return (
      <div className="state-card">
        <div className="spinner" />
        <p>Loading your salon data…</p>
      </div>
    );
  if (error)
    return (
      <div className="state-card">
        <div className="state-icon">!</div>
        <h3>Couldn’t load this data</h3>
        <p>{error}</p>
        <button className="btn btn-light" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  return null;
}
