import { type ColumnDef } from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import type {
  Columns,
  Columns as ColumnWithType,
  DataTableFilters,
} from "@/types/types";

export interface DataTableProps<TData> {
  columns: Columns<TData>[];
  data: TData[];
  children?: React.ReactNode;
  totalPages?: number;
  currentPage?: number;
  isLoading?: boolean;
  onFilterChange?: (filters: DataTableFilters) => void;
  getRowClassName?: (row: TData) => string;
  onRowSelect?: (row: TData | null) => void;
  placeholderInput?: string;
}

export default function DataTable<TData>({
  columns,
  data,
  children,
  isLoading = false,
  getRowClassName,
  onRowSelect,
}: DataTableProps<TData>) {
  // TODO: Implement useOrder hook or create a useState for order state
  
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedColumns = useMemo<ColumnDef<TData, any>[]>(() => {
    return columns.map((col) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (col.cell) return col as ColumnDef<TData, any>;
      if (col.type === "badge") {
        return {
          ...col,
          cell: ({ getValue }) => (
            <Badge
              className={
                col.variant === "secondary"
                  ? "bg-(--background) px-2 py-1 border border-gray-300 text-gray-700"
                  : ""
              }
              variant={col.variant ?? "secondary"}
            >
              {String(getValue() ?? "")}
            </Badge>
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as ColumnDef<TData, any>;
      }

      if (col.type === "object") {
        return {
          ...col,
          cell: ({ getValue }) => {
            const v = getValue() as unknown as
              | Record<string, unknown>
              | null
              | undefined;
            if (!v || typeof v !== "object") {
              return <span>{String(v ?? "")}</span>;
            }

            Object.keys(v).forEach((key) => {
              if (col.objectKeys && !col.objectKeys.includes(key))
                delete v[key];
            });

            const values = Object.values(v);

            const top = v.top ?? v.primary ?? v.label ?? values[0] ?? "";
            const bottom =
              v.bottom ?? v.secondary ?? v.subLabel ?? values[1] ?? "";
            return (
              <div className="flex flex-col">
                <span className="font-medium leading-tight">
                  {String(top ?? "")}
                </span>
                <span className="text-muted-foreground text-xs leading-tight">
                  {String(bottom ?? "")}
                </span>
              </div>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as ColumnDef<TData, any>;
      }

      return {
        ...col,
        cell: ({ getValue }) => <span>{String(getValue() ?? "")}</span>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as ColumnDef<TData, any>;
    });
  }, [columns]);

  const table = useReactTable({
    data,
    columns: normalizedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });



  return (
    <>
      <div className="border rounded-md bg-white mt-4 md:mt-10 mx-2 md:mx-10 p-3 md:p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-4">
       
          <div className="w-full sm:w-auto sm:ml-auto">{children}</div>
        </div>


        <div className="flex-1 min-h-0 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : table.getRowModel().rows.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id}>
                      {group.headers.map((header) => {
                        const columnDef = header.column
                          .columnDef as ColumnWithType<TData>;

                        return (
                          <TableHead key={header.id}>
                            {columnDef.isOrderable ? (
                              <button
                                className="flex items-center gap-2 hover:text-foreground transition-colors"
                                disabled={isLoading}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                               
                              </button>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={`h-16 ${
                        getRowClassName?.(row.original) ?? ""
                      } ${
                        selectedRowId === row.id
                          ? "bg-blue-50 dark:bg-blue-950"
                          : ""
                      } ${
                        onRowSelect
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                          : ""
                      }`}
                      onClick={() => {
                        if (onRowSelect) {
                          const newSelectedId =
                            selectedRowId === row.id ? null : row.id;
                          setSelectedRowId(newSelectedId);
                          onRowSelect(newSelectedId ? row.original : null);
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center py-10 ">
              <p className="font-semibold text-xl">Nada por aqui ainda...</p>
            </div>
          )}
        </div>
      </div>


    </>
  );
}