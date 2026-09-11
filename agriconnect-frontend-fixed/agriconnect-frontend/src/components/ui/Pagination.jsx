import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded border border-line bg-card text-ink disabled:opacity-40 hover:bg-paper"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm text-ink/70">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded border border-line bg-card text-ink disabled:opacity-40 hover:bg-paper"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
