import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Scale, Loader2, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { fetchWeightLogs, saveWeightLog } from '../api/api';
import clsx from 'clsx';

const WeightEntry = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [weight, setWeight] = useState('');

  // Fetch weight logs
  const { data: weightLogs, isLoading } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: fetchWeightLogs
  });

  // Save weight mutation
  const saveMutation = useMutation({
    mutationFn: saveWeightLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      toast.success('Weight entry saved successfully!');
      setWeight('');
      setDate(dayjs().format('YYYY-MM-DD'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save weight entry');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!weight || parseFloat(weight) <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    saveMutation.mutate({
      date,
      weight: parseFloat(weight)
    });
  };

  // Check if entry exists for selected date
  const existingEntry = weightLogs?.find(log => log.date === date);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Weight Entry
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track your daily weight to monitor progress
        </p>
      </div>

      {/* Weight Entry Form */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Input */}
          <div>
            <label 
              htmlFor="date" 
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <Calendar className="h-4 w-4" />
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={dayjs().format('YYYY-MM-DD')}
              className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
              required
            />
            {existingEntry && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
                ⚠️ Entry already exists for this date ({existingEntry.weight} kg). Saving will update it.
              </p>
            )}
          </div>

          {/* Weight Input */}
          <div>
            <label 
              htmlFor="weight" 
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <Scale className="h-4 w-4" />
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 75.5"
              className="w-full rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {saveMutation.isPending ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Weight Entry'
            )}
          </button>
        </form>
      </div>

      {/* Recent Entries */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Entries
        </h2>

        {isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-slate-500">Loading entries...</p>
          </div>
        ) : weightLogs && weightLogs.length > 0 ? (
          <div className="space-y-2">
            {weightLogs.slice(0, 10).map(log => (
              <div
                key={log._id}
                className={clsx(
                  'flex items-center justify-between rounded-lg border p-3',
                  log.date === dayjs().format('YYYY-MM-DD')
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-900/20'
                    : 'border-surface-border bg-surface-muted dark:border-slate-800 dark:bg-slate-950'
                )}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {dayjs(log.date).format('MMMM D, YYYY')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {dayjs(log.date).format('dddd')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {log.weight} kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted p-8 text-center dark:border-slate-800 dark:bg-slate-950">
            <Scale className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No weight entries yet. Start tracking your progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightEntry;
