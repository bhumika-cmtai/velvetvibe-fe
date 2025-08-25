"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminUser } from '@/lib/admin-data';
import { Loader2 } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (userId: string, data: Partial<AdminUser>) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  // --- CHANGE START: Use a single state object for the form data ---
  const [formData, setFormData] = useState<Partial<AdminUser>>({});
  // --- CHANGE END ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // When the user prop changes, update the form data state
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        gender: user.gender,
        status: user.status,
      });
    }
  }, [user]);
  
  if (!user) return null;

  // --- CHANGE START: Unified handler for all input changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof AdminUser, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // --- CHANGE END ---

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
        // Pass the entire formData object, which contains only the changed fields
        await onSave(user._id, formData);
    } catch (error) {
        console.error("Save failed in modal:", error);
    } finally {
        // This will be handled by the onOpenChange, but is good for safety
        setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        setIsSubmitting(false);
        onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle>Edit User: {user.fullName}</DialogTitle>
            <DialogDescription>Update the user's details below.</DialogDescription>
        </DialogHeader>
        {/* --- CHANGE START: Expanded form with new fields --- */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Full Name</Label>
            <Input id="fullName" value={formData.fullName || ''} onChange={handleChange} className="col-span-3" disabled={isSubmitting}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} className="col-span-3" disabled={isSubmitting}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">Gender</Label>
            <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)} disabled={isSubmitting}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Select value={formData.role} onValueChange={(v) => handleSelectChange('role', v)} disabled={isSubmitting}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)} disabled={isSubmitting}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* --- CHANGE END --- */}
        <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}