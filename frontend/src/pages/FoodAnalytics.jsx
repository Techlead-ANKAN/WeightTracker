import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { 
  Calendar, TrendingUp, TrendingDown, Apple, Utensils, 
  ChevronLeft, ChevronRight, PieChartIcon, Activity, 
  Coffee, Sun, Sunset, Moon, Filter, Download
} from 'lucide-react';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { fetchDailyLogsRange } from '../api/api';

const COLORS = {
  breakfast: '#f59e0b',
  lunch: '#10b981',
  dinner: '#6366f1',
  total: '#8b5cf6'
};

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon
};

const FoodAnalytics = () => {
  const [dateRange, setDateRange] = useState('7'); // 7, 14, 30 days
  const [selectedMeal, setSelectedMeal] = useState('all'); // all, breakfast, lunch, dinner
  
  const endDate = dayjs().format('YYYY-MM-DD');
  const startDate = dayjs().subtract(parseInt(dateRange), 'days').format('YYYY-MM-DD');

  // Fetch data for the selected date range
  const { data: logs, isLoading } = useQuery({
    queryKey: ['foodLogs', startDate, endDate],
    queryFn: () => fetchDailyLogsRange(startDate, endDate)
  });

  // Process data for visualizations
  const analytics = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        dailyTotals: [],
        mealDistribution: [],
        averages: { breakfast: 0, lunch: 0, dinner: 0, total: 0 },
        trends: [],
        topFoods: [],
        consistency: 0,
        totalDays: 0,
        loggedDays: 0
      };
    }

    // Daily totals for area chart
    const dailyTotals = logs.map(log => ({
      date: dayjs(log.date).format('MMM D'),
      fullDate: log.date,
      breakfast: log.breakfast?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0,
      lunch: log.lunch?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0,
      dinner: log.dinner?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0,
      total: 0
    }));

    dailyTotals.forEach(day => {
      day.total = day.breakfast + day.lunch + day.dinner;
    });

    // Meal distribution (pie chart)
    const totalBreakfast = dailyTotals.reduce((sum, d) => sum + d.breakfast, 0);
    const totalLunch = dailyTotals.reduce((sum, d) => sum + d.lunch, 0);
    const totalDinner = dailyTotals.reduce((sum, d) => sum + d.dinner, 0);
    const grandTotal = totalBreakfast + totalLunch + totalDinner;

    const mealDistribution = grandTotal > 0 ? [
      { name: 'Breakfast', value: totalBreakfast, percentage: ((totalBreakfast / grandTotal) * 100).toFixed(1) },
      { name: 'Lunch', value: totalLunch, percentage: ((totalLunch / grandTotal) * 100).toFixed(1) },
      { name: 'Dinner', value: totalDinner, percentage: ((totalDinner / grandTotal) * 100).toFixed(1) }
    ] : [
      { name: 'Breakfast', value: 0, percentage: '0' },
      { name: 'Lunch', value: 0, percentage: '0' },
      { name: 'Dinner', value: 0, percentage: '0' }
    ];

    // Calculate averages
    const loggedDays = logs.length;
    const averages = {
      breakfast: Math.round(totalBreakfast / loggedDays),
      lunch: Math.round(totalLunch / loggedDays),
      dinner: Math.round(totalDinner / loggedDays),
      total: Math.round(grandTotal / loggedDays)
    };

    // Top foods consumed
    const foodFrequency = {};
    logs.forEach(log => {
      ['breakfast', 'lunch', 'dinner'].forEach(meal => {
        log[meal]?.forEach(food => {
          const key = food.name;
          if (!foodFrequency[key]) {
            foodFrequency[key] = { name: food.name, count: 0, grams: 0 };
          }
          foodFrequency[key].count++;
          foodFrequency[key].grams += food.grams || 0;
        });
      });
    });

    const topFoods = Object.values(foodFrequency)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Consistency (percentage of days logged)
    const totalDays = parseInt(dateRange);
    const consistency = Math.round((loggedDays / totalDays) * 100);

    // Trend calculation (comparing first half vs second half)
    const midPoint = Math.floor(dailyTotals.length / 2);
    const firstHalfAvg = midPoint > 0 
      ? dailyTotals.slice(0, midPoint).reduce((sum, d) => sum + d.total, 0) / midPoint 
      : 0;
    const secondHalfAvg = dailyTotals.length > midPoint
      ? dailyTotals.slice(midPoint).reduce((sum, d) => sum + d.total, 0) / (dailyTotals.length - midPoint)
      : 0;
    const trendPercentage = firstHalfAvg > 0 
      ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100).toFixed(1)
      : '0';

    return {
      dailyTotals,
      mealDistribution,
      averages,
      topFoods,
      consistency,
      totalDays,
      loggedDays,
      trendPercentage
    };
  }, [logs, dateRange]);

  const handleExport = () => {
    if (!logs || logs.length === 0) return;
    
    const csvContent = [
      ['Date', 'Breakfast (g)', 'Lunch (g)', 'Dinner (g)', 'Total (g)'],
      ...analytics.dailyTotals.map(d => [
        d.fullDate,
        d.breakfast,
        d.lunch,
        d.dinner,
        d.total
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-analytics-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-8">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <Activity className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                Food Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Track your eating patterns and insights
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Range Selector */}
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                {['7', '14', '30'].map(days => (
                  <button
                    key={days}
                    onClick={() => setDateRange(days)}
                    className={clsx(
                      'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all',
                      dateRange === days
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    )}
                  >
                    {days}d
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={!logs || logs.length === 0}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Average Daily Intake */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl">
                <Utensils className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {analytics.averages.total}g
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Avg Daily Intake
            </div>
          </div>

          {/* Logged Days */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {analytics.loggedDays}/{analytics.totalDays}
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Days Logged
            </div>
          </div>

          {/* Consistency */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {analytics.consistency}%
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Consistency
            </div>
          </div>

          {/* Trend */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={clsx(
                "p-2 sm:p-3 rounded-lg sm:rounded-xl",
                parseFloat(analytics.trendPercentage) >= 0 
                  ? "bg-orange-100 dark:bg-orange-900/30" 
                  : "bg-teal-100 dark:bg-teal-900/30"
              )}>
                {parseFloat(analytics.trendPercentage) >= 0 ? (
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
                )}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {analytics.trendPercentage > 0 ? '+' : ''}{analytics.trendPercentage}%
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Recent Trend
            </div>
          </div>
        </div>

        {/* Charts Row 1: Daily Intake & Meal Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Daily Intake Over Time */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Daily Food Intake
            </h3>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <AreaChart data={analytics.dailyTotals}>
                <defs>
                  <linearGradient id="colorBreakfast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.breakfast} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.breakfast} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLunch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.lunch} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.lunch} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDinner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.dinner} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.dinner} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Grams', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Area type="monotone" dataKey="breakfast" stroke={COLORS.breakfast} fill="url(#colorBreakfast)" name="Breakfast" />
                <Area type="monotone" dataKey="lunch" stroke={COLORS.lunch} fill="url(#colorLunch)" name="Lunch" />
                <Area type="monotone" dataKey="dinner" stroke={COLORS.dinner} fill="url(#colorDinner)" name="Dinner" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Meal Distribution Pie Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Meal Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={analytics.mealDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.mealDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                  formatter={(value) => `${value}g`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2: Average by Meal & Top Foods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Average Intake by Meal */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Average by Meal
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(analytics.averages).filter(([key]) => key !== 'total').map(([meal, grams]) => {
                const Icon = MEAL_ICONS[meal];
                const percentage = analytics.averages.total > 0 
                  ? ((grams / analytics.averages.total) * 100).toFixed(0)
                  : '0';
                return (
                  <div key={meal}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: COLORS[meal] }} />
                        <span className="text-xs sm:text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                          {meal}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {grams}g ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 sm:h-3">
                      <div
                        className="h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[meal]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Foods Consumed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
              <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Top Foods
            </h3>
            <div className="space-y-3">
              {analytics.topFoods.slice(0, 8).map((food, index) => (
                <div 
                  key={food.name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">
                      {food.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {food.count}x
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {food.grams}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {(!logs || logs.length === 0) && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <Activity className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Data Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Start logging your daily food intake to see detailed analytics and insights about your eating patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodAnalytics;
