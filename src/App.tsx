import { useState, useEffect, useCallback } from "react";
import { AlertForm } from "@/components/alert-form";
import { AlertsTable } from "@/components/alerts-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { alertService } from "@/services/alertService";
import type { Alert, PaginatedResponse } from "@/services/alertService";
import { Loader2, X, Plane } from "lucide-react";
import { toast } from "sonner";

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    country: "",
    status: "",
  });

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse = await alertService.getAlerts({
        ...appliedFilters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setAlerts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Failed to fetch alerts");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters(filters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.country]);

  useEffect(() => {
    setAppliedFilters(filters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters.status]);

  const handleClearFilters = () => {
    setFilters({ country: "", status: "" });
    setAppliedFilters({ country: "", status: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = appliedFilters.country || appliedFilters.status;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster position="bottom-right" />

      <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Visa Slot Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                The Flying Panda Internal Tool
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Alert</CardTitle>
            <CardDescription>
              Set up a new visa slot alert to track availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertForm onSuccess={fetchAlerts} />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Active Alerts</CardTitle>
                <CardDescription>
                  Manage and track your visa slot alerts
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Filter by country..."
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setAppliedFilters(filters);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }
                  }}
                  className="bg-background"
                />
              </div>

              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <AlertsTable alerts={alerts} onUpdate={fetchAlerts} />

                {pagination.total > 0 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.limit}
                    total={pagination.total}
                    onPageChange={(page) =>
                      setPagination({ ...pagination, page })
                    }
                    onPageSizeChange={(limit) =>
                      setPagination({ ...pagination, limit, page: 1 })
                    }
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 The Flying Panda - Visa Slot Tracker</p>
          <p>
            Created with ❤️ by{" "}
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/JeetDas5"
            >
              Jeet Das
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
