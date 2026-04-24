import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function PaginationDemo() {
  return (
    <PreviewFrame>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious type="button" aria-label="Previous page" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext type="button" aria-label="Next page" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </PreviewFrame>
  );
}
