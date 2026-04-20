import type { HTMLAttributes } from "react";

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

