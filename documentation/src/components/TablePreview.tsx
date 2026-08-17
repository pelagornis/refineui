import { useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const invoices = [
  {
    id: "INV-001",
    customer: "Acme Studio",
    method: "Card",
    status: "Paid" as const,
    amount: "$1,250.00",
  },
  {
    id: "INV-002",
    customer: "Northwind",
    method: "Transfer",
    status: "Pending" as const,
    amount: "$890.00",
  },
  {
    id: "INV-003",
    customer: "Contoso",
    method: "Card",
    status: "Paid" as const,
    amount: "$420.50",
  },
  {
    id: "INV-004",
    customer: "Fabrikam",
    method: "Invoice",
    status: "Failed" as const,
    amount: "$64.00",
  },
];

function statusVariant(status: "Paid" | "Pending" | "Failed") {
  if (status === "Paid") return "success" as const;
  if (status === "Pending") return "warning" as const;
  return "danger" as const;
}

export default function TablePreview() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Looks>
      <Look align="stretch">
        <Card variant="outlined" className="w-full">
          <CardHeader className="border-b-refineui-thin border-refineui-alias-border-subtle">
            <CardHeaderMain>
              <Stack direction="row" gap="sizeXSmall" align="center">
                <Badge variant="neutral">Billing</Badge>
                <Text variant="captionMd" className="text-refineui-alias-foreground-tertiary">
                  Last 30 days
                </Text>
              </Stack>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Recent payments and outstanding balances.</CardDescription>
            </CardHeaderMain>
          </CardHeader>
          <CardContent className="px-0 pb-refineui-size-medium pt-refineui-size-small">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((row) => {
                  const selected = selectedId === row.id;
                  return (
                    <TableRow
                      key={row.id}
                      data-state={selected ? "selected" : undefined}
                      aria-selected={selected || undefined}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedId((prev) => (prev === row.id ? null : row.id))
                      }
                    >
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell className="text-refineui-alias-foreground-secondary">
                        {row.customer}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-refineui-alias-foreground-secondary">
                        {row.method}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right tabular-nums">$2,624.50</TableCell>
                </TableRow>
              </TableFooter>
              <TableCaption>Four invoices in this period.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </Look>
    </Looks>
  );
}
