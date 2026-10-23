import "./Pagination.css";
import { Button } from "./ui/Button";
import { Text } from "./ui/Text";

export function Pagination({ pagination, onPageChange }) {
  const { page, limit, total, totalPages } = pagination;
  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <Text as="span">
        Showing {firstItem}–{lastItem} of {total}
      </Text>
      <div className="pagination-actions">
        <Button
          variant="secondary"
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Text as="span">
          Page {page} of {Math.max(totalPages, 1)}
        </Text>
        <Button
          variant="secondary"
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
