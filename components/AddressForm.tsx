"use client";

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Address, addAddress, updateAddress } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFormProps {
  initialData: Address | null;
  onClose: () => void;
}

export function AddressForm({ initialData, onClose }: AddressFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        phoneNumber: initialData.phoneNumber,
        street: initialData.street,
        city: initialData.city,
        state: initialData.state,
        zipCode: initialData.zipCode,
      });
    } else {
      // Reset form for "Add New"
      setFormData({ fullName: '', phoneNumber: '', street: '', city: '', state: '', zipCode: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      // Update existing address
      dispatch(updateAddress({ ...initialData, ...formData }));
    } else {
      // Add new address
      dispatch(addAddress(formData));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" value={formData.street} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="state">State / Province</Label>
          <Input id="state" value={formData.state} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="zipCode">Zip / Postal Code</Label>
          <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">{initialData ? 'Save Changes' : 'Add Address'}</Button>
      </div>
    </form>
  );
}