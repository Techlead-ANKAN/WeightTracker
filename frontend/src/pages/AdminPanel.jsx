import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchFoods } from '../api/api';
import apiClient from '../api/client';
import clsx from 'clsx';

const AdminPanel = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    portionLabel: '',
    grams: '',
    mealType: 'breakfast'
  });

  // Fetch all foods
  const { data: foods, isLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: fetchFoods
  });

  // Add food mutation
  const addFoodMutation = useMutation({
    mutationFn: async (foodData) => {
      const response = await apiClient.post('/foods', foodData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item added successfully!');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add food item');
    }
  });

  // Update food mutation
  const updateFoodMutation = useMutation({
    mutationFn: async ({ id, foodData }) => {
      const response = await apiClient.put(`/foods/${id}`, foodData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item updated successfully!');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update food item');
    }
  });

  // Delete food mutation
  const deleteFoodMutation = useMutation({
    mutationFn: async (foodId) => {
      const response = await apiClient.delete(`/foods/${foodId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food item deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete food item');
    }
  });

  const resetForm = () => {
    setFormData({ _id: '', name: '', portionLabel: '', grams: '', mealType: 'breakfast' });
    setShowForm(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (food) => {
    setFormData({
      _id: food._id,
      name: food.name,
      portionLabel: food.portionLabel,
      grams: food.grams.toString(),
      mealType: food.mealType
    });
    setEditMode(true);
    setEditingId(food._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData._id || !formData.name || !formData.portionLabel || !formData.grams || !formData.mealType) {
      toast.error('All fields are required');
      return;
    }

    if (parseFloat(formData.grams) <= 0) {
      toast.error('Grams must be greater than 0');
      return;
    }

    const foodData = {
      ...formData,
      grams: parseFloat(formData.grams)
    };

    if (editMode) {
      updateFoodMutation.mutate({ id: editingId, foodData });
    } else {
      addFoodMutation.mutate(foodData);
    }
  };

  const handleDelete = (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      deleteFoodMutation.mutate(foodId);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Count total foods
  const totalFoods = foods 
    ? (foods.breakfast?.length || 0) + (foods.lunch?.length || 0) + (foods.dinner?.length || 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage food items in the database
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Food Item
            </>
          )}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Foods" value={totalFoods} />
        <StatCard label="Breakfast Items" value={foods?.breakfast?.length || 0} />
        <StatCard label="Lunch Items" value={foods?.lunch?.length || 0} />
        <StatCard label="Dinner Items" value={foods?.dinner?.length || 0} />
      </div>

      {/* Add Food Form */}
      {showForm && (
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {editMode ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Food ID */}
              <div>
                <label htmlFor="_id" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Food ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="_id"
                  type="text"
                  value={formData._id}
                  onChange={handleChange('_id')}
                  placeholder="e.g., bf_bread_2"
                  disabled={editMode}
                  className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Format: bf_name, ln_name, or dn_name
                </p>
              </div>

              {/* Food Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Food Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="e.g., Bread"
                  className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Portion Label */}
              <div>
                <label htmlFor="portionLabel" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Portion Label <span className="text-rose-500">*</span>
                </label>
                <input
                  id="portionLabel"
                  type="text"
                  value={formData.portionLabel}
                  onChange={handleChange('portionLabel')}
                  placeholder="e.g., 2 slices"
                  className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Grams */}
              <div>
                <label htmlFor="grams" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Grams <span className="text-rose-500">*</span>
                </label>
                <input
                  id="grams"
                  type="number"
                  step="1"
                  min="1"
                  value={formData.grams}
                  onChange={handleChange('grams')}
                  placeholder="e.g., 59"
                  className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Meal Type */}
              <div className="sm:col-span-2">
                <label htmlFor="mealType" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Meal Type <span className="text-rose-500">*</span>
                </label>
                <select
                  id="mealType"
                  value={formData.mealType}
                  onChange={handleChange('mealType')}
                  className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addFoodMutation.isPending || updateFoodMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {(addFoodMutation.isPending || updateFoodMutation.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {editMode ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {editMode ? 'Update Food Item' : 'Add Food Item'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Food Lists */}
      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:border-slate-800">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          Loading foods...
        </div>
      ) : (
        <div className="space-y-6">
          <FoodList
            title="Breakfast Foods"
            foods={foods?.breakfast || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteFoodMutation.isPending}
          />
          <FoodList
            title="Lunch Foods"
            foods={foods?.lunch || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteFoodMutation.isPending}
          />
          <FoodList
            title="Dinner Foods"
            foods={foods?.dinner || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteFoodMutation.isPending}
          />
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-card dark:bg-slate-900 dark:border-slate-800">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
};

// Food List Component
const FoodList = ({ title, foods, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title} ({foods.length})
      </h2>
      {foods.length > 0 ? (
        <div className="space-y-2">
          {foods.map(food => (
            <div
              key={food._id}
              className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-muted p-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {food.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {food.portionLabel} • {food.grams}g • ID: {food._id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(food)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:hover:bg-blue-900/20"
                  aria-label="Edit food item"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(food._id)}
                  disabled={isDeleting}
                  className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-900/20"
                  aria-label="Delete food item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500 py-4">
          No foods in this category
        </p>
      )}
    </div>
  );
};

export default AdminPanel;
