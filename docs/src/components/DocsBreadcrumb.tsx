import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@refineui/react";
import type { DocsBreadcrumbCrumb } from "../lib/docs-breadcrumb";
import { withBase } from "../lib/docs-path";

export type DocsBreadcrumbProps = {
    items: DocsBreadcrumbCrumb[];
};

export default function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
    if (items.length === 0) return null;

    return (
        <Breadcrumb data-refineui-docs-breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Fragment key={`${item.label}-${index}`}>
                            {index > 0 ? <BreadcrumbSeparator /> : null}
                            <BreadcrumbItem>
                                {isLast || !item.href ? (
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={withBase(item.href)}>
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
