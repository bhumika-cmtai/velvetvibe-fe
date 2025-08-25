"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store'; // Ensure AppDispatch is exported from your store
import { fetchInquiries, updateInquiry, deleteInquiry } from '@/lib/redux/slices/contactSlice';
import { toast } from 'sonner';

// UI Components
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit, Eye } from 'lucide-react';

// --- TYPE DEFINITION ---
interface ContactInquiry {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    message: string;
    size?: string;
    referenceImage?: string;
    status: "New" | "Contacted" | "Completed" | "Rejected";
    createdAt: string;
    updatedAt: string;
}

// =================================================================
// --- VIEW INQUIRY MODAL (IN-PAGE COMPONENT) ---
// =================================================================
function ViewInquiryModal({ isOpen, onClose, inquiry }: { isOpen: boolean, onClose: () => void, inquiry: ContactInquiry | null }) {
  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Inquiry from: {inquiry.fullName}</DialogTitle></DialogHeader>
        <div className="py-4 space-y-4">
          {inquiry.referenceImage && (
            <div>
            <Label>Reference Image</Label>
            {/* --- FIX START: Create a fixed-height container to properly size and center the image --- */}
            <div className="mt-2 flex h-64 w-full items-center justify-center rounded-lg border bg-muted">
              <Image
                src={inquiry.referenceImage}
                alt="Reference Image"
                width={500}
                height={500}
                // Let the image fill the container's height, with auto width and contain scaling
                className="h-full w-auto object-contain"
              />
            </div>
              {/* --- FIX END --- */}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Email</Label><p className="text-sm text-muted-foreground pt-1">{inquiry.email}</p></div>
            <div><Label>Phone</Label><p className="text-sm text-muted-foreground pt-1">{inquiry.phoneNumber || 'N/A'}</p></div>
            <div><Label>Size</Label><p className="text-sm text-muted-foreground pt-1">{inquiry.size || 'N/A'}</p></div>
            <div>
              <Label>Status</Label>
              <div className="text-sm pt-1">
                <Badge>{inquiry.status}</Badge>
              </div>
            </div>
          </div>
          <div>
            <Label>Message</Label>
            <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-md border mt-1">{inquiry.message}</p>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =================================================================
// --- EDIT INQUIRY MODAL (IN-PAGE COMPONENT) ---
// =================================================================
function EditInquiryModal({ isOpen, onClose, inquiry, onSave }: { isOpen: boolean, onClose: () => void, inquiry: ContactInquiry | null, onSave: (id: string, data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<Partial<ContactInquiry>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setFormData(inquiry);
      setImageFile(null);
    }
  }, [inquiry]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry) return;
    setIsSubmitting(true);
    
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== '_id' && value !== undefined && value !== null) {
        submissionData.append(key, value as string);
      }
    });
    if (imageFile) {
      submissionData.append('referenceImage', imageFile);
    }

    await onSave(inquiry._id, submissionData);
    setIsSubmitting(false);
  };

  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit Inquiry: {inquiry.fullName}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div><Label htmlFor="fullName">Full Name</Label><Input  id="fullName" value={formData.fullName || ''} onChange={e => setFormData(p => ({...p, fullName: e.target.value}))} disabled /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email || ''} onChange={e => setFormData(p => ({...p, email: e.target.value}))} disabled /></div>
            <div><Label>Status</Label><Select value={formData.status} onValueChange={(v: ContactInquiry['status']) => setFormData(p => ({...p, status: v}))} disabled={isSubmitting}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></div>
            {/* <div><Label htmlFor="newReferenceImage">Replace Image</Label><Input id="newReferenceImage" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="mt-1" disabled={isSubmitting} /></div> */}
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// =================================================================
// --- MAIN PAGE COMPONENT ---
// =================================================================
export default function ContactAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { inquiries, status, error } = useSelector((state: RootState) => state.contact);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<ContactInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInquiries());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // This effect runs on initial load and whenever statusFilter changes.
    // If filter is 'All', we pass `undefined` so no query param is sent.
    dispatch(fetchInquiries(statusFilter === 'All' ? undefined : statusFilter));
  }, [statusFilter, dispatch]);

  const handleViewClick = (inquiry: ContactInquiry) => {
    setCurrentInquiry(inquiry);
    setIsViewOpen(true);
  };

  const handleEditClick = (inquiry: ContactInquiry) => {
    setCurrentInquiry(inquiry);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (inquiry: ContactInquiry) => {
    setCurrentInquiry(inquiry);
    setIsDeleteOpen(true);
  };

  const handleSave = async (inquiryId: string, formData: FormData) => {
    try {
      await dispatch(updateInquiry({ inquiryId, formData })).unwrap();
      setIsEditOpen(false); // Close modal on success
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentInquiry) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteInquiry(currentInquiry._id)).unwrap();
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === 'loading') return <div className="p-8 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (status === 'failed') return <div className="p-8 text-red-600 text-center">Error fetching data: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
        <div className="w-full sm:w-auto min-w-[180px] bg-white">
          {/* <Label>Filter by status</Label> */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Select a status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="rounded-md border bg-white shadow-md p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length > 0 ? inquiries.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell>
                  <div className="font-medium">{inquiry.fullName}</div>
                  <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                </TableCell>
                <TableCell className="max-w-sm truncate">{inquiry.message}</TableCell>
                <TableCell><Badge>{inquiry.status}</Badge></TableCell>
                <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleViewClick(inquiry)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(inquiry)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(inquiry)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={5} className="text-center h-24">No inquiries yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* --- MODALS --- */}
      <ViewInquiryModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} inquiry={currentInquiry} />
      <EditInquiryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} inquiry={currentInquiry} onSave={handleSave} />
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action will permanently delete the inquiry from "{currentInquiry?.fullName}". This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteConfirm}>
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}