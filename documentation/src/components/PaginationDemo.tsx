import { useState } from "react";
import { Pagination } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <PreviewFrame>
      <Pagination page={page} totalPages={10} onPageChange={setPage} />
    </PreviewFrame>
  );
}
