"use client";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Badge } from "@/components/ui/badge";
// --- CHANGE: Import AlertDialog components ---
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchUsers, deleteUser, updateUser } from '@/lib/redux/slices/adminSlice';
import { EditUserModal } from '@/components/EditUserModal';
import { ViewUserModal } from '@/components/viewUserModal';
import { AdminUser } from '@/lib/api/admin';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, userStatus, userPagination } = useSelector((state: RootState) => state.admin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // State for modals
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // --- CHANGE: State for the delete confirmation dialog ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debouncing effect for the search input (no changes)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); 
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Data fetching effect (no changes)
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, name: debouncedSearchQuery }));
  }, [dispatch, currentPage, debouncedSearchQuery]);

  const handleEditClick = (user: AdminUser) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleViewClick = (user: AdminUser) => {
    setCurrentUser(user);
    setViewModalOpen(true);
  };

  // --- CHANGE: handleDeleteClick now opens the modal ---
  const handleDeleteClick = (user: AdminUser) => {
    setCurrentUser(user); // Set the user to be deleted
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
  };
  
  // --- NEW: Function to handle the actual deletion after confirmation ---
  const handleDeleteConfirm = async () => {
    if (!currentUser) return;

    setIsDeleting(true);
    try {
      await toast.promise(dispatch(deleteUser(currentUser._id)).unwrap(), {
          loading: 'Deleting user...',
          success: 'User deleted successfully!',
          error: 'Failed to delete user.',
      });
      setIsDeleteDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setCurrentUser(null);
    }
  };
  
  // --- CHANGE: handleUpdateUser now returns the promise ---
  const handleUpdateUser = async (userId: string, data: Partial<AdminUser>) => {
    // This function now returns the promise from toast.promise,
    // which the EditUserModal can `await`.
    await toast.promise(dispatch(updateUser({ userId, updates: data })).unwrap(), {
      loading: 'Updating user...',
      success: () => {
        setEditModalOpen(false); // Close modal on success
        return 'User updated successfully!';
      },
      error: 'Failed to update user.',
    });
  };
  
  const isLoading = userStatus === 'loading';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="flex justify-between items-center mb-4 ">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      {isLoading && (!users || users.length === 0) ? (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="border bg-white shadow-md p-4 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verified</TableHead> 
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.isVerified ? 'default' : 'destructive-outline'}>
                          {user.isVerified ? 'Verified' : 'Not Verified'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewClick(user)}>View</Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                        {/* --- CHANGE: Pass the full user object to handleDeleteClick --- */}
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center h-24">No users found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={userPagination.currentPage === 1 || isLoading}>Previous</Button>
            <span>Page {userPagination.currentPage} of {userPagination.totalPages}</span>
            <Button onClick={() => setCurrentPage(p => p + 1)} disabled={userPagination.currentPage >= userPagination.totalPages || isLoading}>Next</Button>
          </div>
        </>
      )}

      {currentUser && <EditUserModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} user={currentUser} onSave={handleUpdateUser} />}
      {currentUser && <ViewUserModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} user={currentUser} />}

      {/* --- NEW: AlertDialog for Delete Confirmation --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{currentUser?.fullName}" and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}