"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mockOrders } from '@/lib/data';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <Table>
        <TableHeader><TableRow><TableHead>S.No</TableHead><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {mockOrders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>John Doe</TableCell> {/* Mock Name */}
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>₹{order.totalAmount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                 <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Cancel Order</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Cancel this order?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>No</AlertDialogCancel><AlertDialogAction>Yes, Cancel</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}