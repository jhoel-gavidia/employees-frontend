interface EmployeePaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function EmployeePagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: EmployeePaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0 || loading}
      >
        Anterior
      </button>

      <span>
        Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1 || loading}
      >
        Siguiente
      </button>
    </div>
  );
}