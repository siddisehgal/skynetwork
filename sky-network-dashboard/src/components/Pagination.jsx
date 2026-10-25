export function Pagination({ page, pageSize, total, onPageChange }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min(total, start + pageSize - 1);

  return (
    <nav className="flight-pagination" aria-label="Results pagination">
      <span>Showing {start}–{end} of {total}</span>
      <div>
        <button type="button" className="hud-btn hud-btn-outline" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <span>Page {page + 1} of {pageCount}</span>
        <button type="button" className="hud-btn hud-btn-outline" disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </nav>
  );
}