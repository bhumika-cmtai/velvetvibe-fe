"use client";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchUsers, deleteUser, updateUser } from '@/lib/redux/slices/adminSlice';
import { EditUserModal } from '@/components/EditUserModal';
import { ViewUserModal } from '@/components/viewUserModal'; // <-- Import the new modal
import { AdminUser } from '@/lib/admin-data';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, userStatus, userPagination } = useSelector((state: RootState) => state.admin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState('all');
  
  // State for modals
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false); // <-- State for view modal
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const apiGenderFilter = genderFilter === 'all' ? '' : genderFilter;
    dispatch(fetchUsers({ page: currentPage, gender: apiGenderFilter }));
  }, [dispatch, currentPage, genderFilter]);

  const handleFilterChange = (newGender: string) => {
    setGenderFilter(newGender);
    setCurrentPage(1); 
  };

  // --- MODAL HANDLERS ---
  const handleEditClick = (user: AdminUser) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleViewClick = (user: AdminUser) => { // <-- Handler for View button
    setCurrentUser(user);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => { // <-- Handler for Delete button
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      dispatch(deleteUser(userId));
    }
  };
  
  const handleUpdateUser = async (userId: string, data: Partial<AdminUser>) => {
    try {
        await dispatch(updateUser({ userId, updates: data })).unwrap();
        setEditModalOpen(false);
        // No need to re-fetch, the Redux state is updated automatically by the slice
    } catch(error) {
        console.error("Update failed:", error);
    }
  };
  
  const isLoading = userStatus === 'loading';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="flex justify-between items-center mb-4">
        <Select value={genderFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (!users || users.length === 0) ? (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>
                        {/* <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge> */}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* --- ACTION BUTTONS --- */}
                        <Button variant="outline" size="sm" onClick={() => handleViewClick(user)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No users found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={userPagination.currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span>
              Page {userPagination.currentPage} of {userPagination.totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(p => p + 1)} 
              disabled={userPagination.currentPage >= userPagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* --- RENDER MODALS --- */}
      {currentUser && (
        <EditUserModal 
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={currentUser}
          onSave={handleUpdateUser}
        />
      )}

      {currentUser && (
        <ViewUserModal 
          isOpen={isViewModalOpen}
          onClose={() => setViewModalOpen(false)}
          user={currentUser}
        />
      )}
    </div>
  );
}