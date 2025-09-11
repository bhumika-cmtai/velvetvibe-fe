"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
// --- FIX: fetchProducts now requires a page argument ---
import { fetchProducts, deleteProduct, createProduct, updateProduct, fetchProductById } from '@/lib/redux/slices/adminSlice';
import { ViewProductModal } from '@/components/ViewProductModal';
// import {products as Product}  from '@/lib/data';
import { Product } from '@/lib/types/product';

import { EditProductModal } from '@/components/EditProductModal';
import { AddProductModal } from '@/components/AddProductModal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Assuming you've added productPagination to the slice as per the previous request
  const { products, error, status, selectedProduct, selectedProductStatus, productPagination } = useSelector((state: RootState) => state.admin);
  
  // This component will now manage the current page
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // --- UPDATED: useEffect to fetch products for the current page ---
  useEffect(() => {
    // We will fetch products whenever the currentPage state changes.
    // The limit is hardcoded here but could be a state variable if you want a page size selector.
    dispatch(fetchProducts({ page: currentPage, limit: 10 }));
  }, [currentPage, dispatch]);
  
  // --- All handler functions (handleCreateNew, handleUpdate, etc.) are correct ---
  const handleCreateNew = async (formData: FormData) => {
    try {
      await dispatch(createProduct(formData)).unwrap();
      setIsAddDialogOpen(false);
      // After creating, go back to page 1 to see the new product.
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        // If we are already on page 1, we need to re-trigger the fetch.
        dispatch(fetchProducts({ page: 1, limit: 10 }));
      }
    } catch(e) { console.error(e) }
  };

  const handleUpdate = async (updatedData: Partial<Product>, newImages: (File | null)[], newVideo: File | null) => {
    if (!currentProduct) {
      return toast.error("No product selected for update.");
    }
    
    const formData = new FormData();

    // 1. Append all text/select data
    Object.keys(updatedData).forEach(key => {
      const typedKey = key as keyof Product;
      // This simple check prevents sending the whole object back if nothing changed.
      // A more robust check would compare against currentProduct[typedKey].
      if (updatedData[typedKey] !== undefined) {
        const value = updatedData[typedKey];
        if (value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, value.join(','));
          } else {
            formData.append(key, String(value));
          }
        }
      }
    });

    // 2. Append any NEW image files
    newImages.forEach(file => {
      if (file) formData.append('images', file);
    });

    // 3. Append a NEW video file if it exists
    if (newVideo) {
      formData.append('video', newVideo);
    }
    
    // Check if anything is actually being sent
    if ([...formData.entries()].length === 0) {
        toast.info("No changes were made.");
        setIsEditDialogOpen(false);
        return;
    }

    try {
      // 4. Dispatch the async thunk and wait for it to complete
      await dispatch(updateProduct({ productId: currentProduct._id, formData })).unwrap();
      // 5. Close the modal ONLY on success
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      // On failure, the modal's internal state needs to be reset for the next attempt.
      // The EditProductModal's onOpenChange handles resetting its `isSubmitting` state.
    }
  };


  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };


  const handleDeleteConfirm = async () => {
    if (!currentProduct) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(currentProduct._id)).unwrap();
      setIsDeleteDialogOpen(false);
      // Refetch the current page to update the list
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };
  const handleViewClick = (productId: string) => {
    dispatch(fetchProductById(productId));
    setIsViewDialogOpen(true);
  };

  // --- Pagination handlers ---
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, productPagination.totalPages));
  };
  
  if (status === 'loading') return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (status === 'failed') return <div className="p-8 text-red-600">Error fetching data: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Product</Button>
      </div>

      <div className='bg-white p-4 rounded-md shadow-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Type</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product._id}>
                <TableCell><Image src={product.images[0] || '/placeholder.svg'} alt={product.name} width={48} height={48} className="object-cover rounded-md" /></TableCell>
                <TableCell className="font-medium">
                <Tooltip>
                      <TooltipTrigger>
                        <p className="max-w-[250px] truncate">
                          {product.name}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{product.name}</p>
                      </TooltipContent>
                    </Tooltip>
                </TableCell>
                <TableCell>₹{product.price.toLocaleString()}</TableCell>
                {/* <TableCell>{product.stock}</TableCell> */}
                <TableCell>"product stock"</TableCell>
                {/* <TableCell className="capitalize">{product.type}</TableCell> */}
                <TableCell className="space-x-2">
                  <Button variant="default" size="sm" onClick={() => handleViewClick(product._id)}>View</Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination Controls --- */}
      <div className="flex items-center justify-end space-x-4 py-4">
        <span className="text-sm text-gray-700">
          Page {productPagination.currentPage} of {productPagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={productPagination.currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={productPagination.currentPage >= productPagination.totalPages}
        >
          Next
        </Button>
      </div>

      {/* --- Modals and Dialogs --- */}
      <AddProductModal 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleCreateNew}
      />
      <ViewProductModal 
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        product={selectedProduct}
        status={selectedProductStatus}
      />
      {currentProduct && (
         <EditProductModal 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            product={currentProduct}
            onSave={handleUpdate}
          />
      )}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{currentProduct?.name}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            {/* --- CHANGE START: Add disabled state and loader to the action button --- */}
            <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
            >
                {isDeleting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                    </>
                ) : (
                    "Delete"
                )}
            </Button>
            {/* --- CHANGE END --- */}
          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}