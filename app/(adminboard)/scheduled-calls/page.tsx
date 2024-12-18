"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ContactForm {
  id: string;
  name: string;
  email: string;
  date: Date;
  time: string;
  message: string;
}

interface AdminForm {
  formId: string;
  status: string;
  feedback: string;
}

const columns: ColumnDef<ContactForm>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "message",
    header: "Additional Info",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const router = useRouter();
        const [status, setStatus] = useState(row.getValue("status") as string);
        const [isApprovedClicked, setIsApprovedClicked] = useState(false);
        const formId = row.original.id;

        const handleStatusChange = async (newStatus: string) => {
            setStatus(newStatus);
            await updateStatus(formId, newStatus);
        };

        const handleJoinCall = () => {
          router.push(`/scheduled-calls/${formId}`);
        };
        

      const updateStatus = async (formId: string, newStatus: string) => {
        const feedback = newStatus === "approved" ? "Your submission has been approved." : ""; 
        try {
          const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/form-reviews`, 
                {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                body: JSON.stringify({ formId, status: newStatus, feedback }),
            }
        );
          if (!response.ok) {
            throw new Error("Failed to update status");
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };

      return (
        <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={status === 'pending' ? 'text-red-600' : 'text-green-600'}
              >
                {status === 'pending' ? 'Pending' : 'Approved'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={status === "pending"}
              onCheckedChange={() => handleStatusChange("pending")}
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={status === "approved"}
              onCheckedChange={() => handleStatusChange("approved")}
            >
              Approved
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {status === "approved" && (
          <Button 
            variant="default"
            onClick={handleJoinCall}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Join Call
          </Button>
        )}
        </div>
      )
    },
  },
];

const SchedulePage = () => {
  const params = useParams();
  const formId = params.formId; 

  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: contactForms,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const fetchScheduledCalls = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/form`, {
            method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
      });
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const submissionsData = await response.json();
        
        const updatedContactForms = await Promise.all(
          submissionsData.map(async (contactform: ContactForm) => {
            const adminform = await fetchAdminForm(contactform.id);
            return {
              ...contactform,
              status: adminform.status || "pending",
            };
          })
        );

        setContactForms(updatedContactForms);
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledCalls();
  }, []);

  const fetchAdminForm = async (formId: string): Promise<AdminForm> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/form-reviews/${formId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch review");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching review:", error);
      return { formId, status: "pending", feedback: "" };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Scheduled Calls</h2>
      <div className="w-full mb-8">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by ID..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                      )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getRowModel().rows.length} row(s)
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
      </div>
    </div>
  );
};

export default SchedulePage;