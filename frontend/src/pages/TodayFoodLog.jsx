import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { fetchFoods, fetchDailyLog, saveDailyLog } from '../api/api';
import clsx from 'clsx';

const TodayFoodLog = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedFoods, setSelectedFoods] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  // Fetch foods master data
  const { data: foods, isLoading: foodsLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: fetchFoods
  });

  // Fetch daily log for selected date
  const { data: dailyLog, isLoading: logLoading } = useQuery({
    queryKey: ['dailyLog', selectedDate],
    queryFn: () => fetchDailyLog(selectedDate),
    enabled: !!selectedDate
  });

  // Update selected foods when daily log loads
  useEffect(() => {
    if (dailyLog) {
      setSelectedFoods({
        breakfast: dailyLog.breakfast?.map(f => typeof f === 'string' ? f : f._id) || [],
        lunch: dailyLog.lunch?.map(f => typeof f === 'string' ? f : f._id) || [],
        dinner: dailyLog.dinner?.map(f => typeof f === 'string' ? f : f._id) || []
      });
    }
  }, [dailyLog]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: saveDailyLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLog', selectedDate] });
      toast.success('Food log saved successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save food log');
    }
  });

  // Handle food selection toggle
  const toggleFood = (mealType, foodId) => {
    setSelectedFoods(prev => {
      const currentSelection = prev[mealType];
      const isSelected = currentSelection.includes(foodId);
      
      return {
        ...prev,
        [mealType]: isSelected
          ? currentSelection.filter(id => id !== foodId)
          : [...currentSelection, foodId]
      };
    });
  };

  // Calculate total grams for each meal
  const mealTotals = useMemo(() => {
    if (!foods) return { breakfast: 0, lunch: 0, dinner: 0 };

    const calculateTotal = (mealType) => {
      return selectedFoods[mealType].reduce((sum, foodId) => {
        const food = foods[mealType]?.find(f => f._id === foodId);
        return sum + (food?.grams || 0);
      }, 0);
    };

    return {
      breakfast: calculateTotal('breakfast'),
      lunch: calculateTotal('lunch'),
      dinner: calculateTotal('dinner')
    };
  }, [foods, selectedFoods]);

  // Handle save
  const handleSave = () => {
    saveMutation.mutate({
      date: selectedDate,
      ...selectedFoods
    });
  };

  // Date navigation
  const goToPreviousDay = () => {
    setSelectedDate(prev => dayjs(prev).subtract(1, 'day').format('YYYY-MM-DD'));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => dayjs(prev).add(1, 'day').format('YYYY-MM-DD'));
  };

  const goToToday = () => {
    setSelectedDate(dayjs().format('YYYY-MM-DD'));
  };

  const isToday = selectedDate === dayjs().format('YYYY-MM-DD');

  if (foodsLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-surface p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:border-slate-800">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
        Loading foods...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="rounded-2xl border border-surface-border bg-surface p-4 shadow-card dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="rounded-lg p-2 text-slate-600 hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {dayjs(selectedDate).format('MMMM D, YYYY')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {dayjs(selectedDate).format('dddd')}
            </p>
          </div>

          <button
            onClick={goToNextDay}
            className="rounded-lg p-2 text-slate-600 hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {!isToday && (
          <div className="mt-3 text-center">
            <button
              onClick={goToToday}
              className="text-sm font-medium text-primary hover:text-primary-dark focus:outline-none focus:underline"
            >
              Go to Today
            </button>
          </div>
        )}
      </div>

      {/* Meal Sections */}
      {logLoading ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:border-slate-800">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          Loading daily log...
        </div>
      ) : (
        <>
          <MealSection
            title="Breakfast"
            mealType="breakfast"
            foods={foods?.breakfast || []}
            selectedFoods={selectedFoods.breakfast}
            onToggle={toggleFood}
            totalGrams={mealTotals.breakfast}
          />

          <MealSection
            title="Lunch"
            mealType="lunch"
            foods={foods?.lunch || []}
            selectedFoods={selectedFoods.lunch}
            onToggle={toggleFood}
            totalGrams={mealTotals.lunch}
          />

          <MealSection
            title="Dinner"
            mealType="dinner"
            foods={foods?.dinner || []}
            selectedFoods={selectedFoods.dinner}
            onToggle={toggleFood}
            totalGrams={mealTotals.dinner}
          />
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Food Log
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Meal Section Component
const MealSection = ({ title, mealType, foods, selectedFoods, onToggle, totalGrams }) => {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Total: <span className="text-primary">{totalGrams}g</span>
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map(food => (
          <label
            key={food._id}
            className={clsx(
              'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition hover:border-primary hover:shadow-sm',
              selectedFoods.includes(food._id)
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-surface-border bg-surface dark:border-slate-800 dark:bg-slate-950'
            )}
          >
            <input
              type="checkbox"
              checked={selectedFoods.includes(food._id)}
              onChange={() => onToggle(mealType, food._id)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {food.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {food.portionLabel} • {food.grams}g
              </p>
            </div>
          </label>
        ))}
      </div>

      {foods.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-4">
          No foods available for {title.toLowerCase()}
        </p>
      )}
    </div>
  );
};

export default TodayFoodLog;
