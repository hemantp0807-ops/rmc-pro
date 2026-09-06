type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 rounded-lg border disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => (
          <button
            key={index}
            onClick={() =>
              onPageChange(index + 1)
            }
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "border"
            }`}
          >
            {index + 1}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 rounded-lg border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}