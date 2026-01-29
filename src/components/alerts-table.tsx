import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import type { Alert } from "@/services/alertService";
import { alertService } from "@/services/alertService";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AlertsTableProps {
  alerts: Alert[];
  onUpdate: () => void;
}

export function AlertsTable({ alerts, onUpdate }: AlertsTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await alertService.updateAlert(id, {
        status: newStatus as "Active" | "Booked" | "Expired",
      });
      toast.success("Status updated successfully!");
      onUpdate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await alertService.deleteAlert(deleteId);
      toast.success("Alert deleted successfully!");
      onUpdate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete alert"
      );
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Booked":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Expired":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "";
    }
  };

  const getVisaTypeColor = (type: string) => {
    switch (type) {
      case "Tourist":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case "Business":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "Student":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
      default:
        return "";
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No alerts found</p>
        <p className="text-sm mt-2">
          Create your first visa slot alert to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Visa Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">#{alert.id}</TableCell>
                <TableCell className="font-medium">{alert.country}</TableCell>
                <TableCell>{alert.city}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getVisaTypeColor(alert.visaType)}
                  >
                    {alert.visaType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={alert.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(alert.id, value)
                    }
                    disabled={updatingId === alert.id}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        {updatingId === alert.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <Badge
                            variant="outline"
                            className={getStatusColor(alert.status)}
                          >
                            {alert.status}
                          </Badge>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">
                        <Badge
                          variant="outline"
                          className={getStatusColor("Active")}
                        >
                          Active
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Booked">
                        <Badge
                          variant="outline"
                          className={getStatusColor("Booked")}
                        >
                          Booked
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Expired">
                        <Badge
                          variant="outline"
                          className={getStatusColor("Expired")}
                        >
                          Expired
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(alert.createdAt), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(alert.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
