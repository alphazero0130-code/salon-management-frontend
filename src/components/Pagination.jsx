import "./Pagination.css";

export function Pagination({ pagination, onPageChange }) {
  const { page, limit, total, totalPages } = pagination;
  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span>
        Showing {firstItem}–{lastItem} of {total}
      </span>
      <div className="pagination-actions">
        <button
          className="btn btn-small btn-light"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          className="btn btn-small btn-light"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
