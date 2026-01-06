import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Loader2, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { fetchWeightLogs } from '../api/api';
import clsx from 'clsx';

const Progress = () => {
  const [timeFilter, setTimeFilter] = useState('30'); // '30', 'all'

  // Fetch weight logs
  const { data: weightLogs, isLoading } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: fetchWeightLogs
  });

  // Filter and prepare chart data
  const chartData = useMemo(() => {
    if (!weightLogs || weightLogs.length === 0) return [];

    let filteredLogs = [...weightLogs];

    // Apply time filter
    if (timeFilter === '30') {
      const thirtyDaysAgo = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
      filteredLogs = filteredLogs.filter(log => log.date >= thirtyDaysAgo);
    }

    // Sort by date (ascending for chart)
    filteredLogs.sort((a, b) => a.date.localeCompare(b.date));

    // Format for recharts
    return filteredLogs.map(log => ({
      date: dayjs(log.date).format('MMM D'),
      fullDate: dayjs(log.date).format('MMMM D, YYYY'),
      weight: log.weight
    }));
  }, [weightLogs, timeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        latest: 0,
        highest: 0,
        lowest: 0,
        change: 0,
        entries: 0
      };
    }

    const weights = chartData.map(d => d.weight);
    const latest = weights[weights.length - 1];
    const first = weights[0];

    return {
      latest: latest.toFixed(1),
      highest: Math.max(...weights).toFixed(1),
      lowest: Math.min(...weights).toFixed(1),
      change: (latest - first).toFixed(1),
      entries: chartData.length
    };
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Progress
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Visualize your weight tracking journey
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current Weight"
          value={`${stats.latest} kg`}
          icon={TrendingUp}
          accent="primary"
        />
        <StatCard
          label="Highest"
          value={`${stats.highest} kg`}
          icon={TrendingUp}
          accent="amber"
        />
        <StatCard
          label="Lowest"
          value={`${stats.lowest} kg`}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label="Total Change"
          value={`${stats.change > 0 ? '+' : ''}${stats.change} kg`}
          icon={TrendingUp}
          accent={stats.change > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card dark:bg-slate-900 dark:border-slate-800">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Weight Trend
          </h2>

          {/* Time Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('30')}
              className={clsx(
                'flex-1 sm:flex-none rounded-lg border px-4 py-2 text-sm font-medium transition',
                timeFilter === '30'
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-border text-slate-600 hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-300'
              )}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={clsx(
                'flex-1 sm:flex-none rounded-lg border px-4 py-2 text-sm font-medium transition',
                timeFilter === 'all'
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-border text-slate-600 hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-300'
              )}
            >
              All Time
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-slate-500">Loading chart data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#2563eb', strokeWidth: 1 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (kg)"
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted p-16 text-center dark:border-slate-800 dark:bg-slate-950">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No weight data available. Start tracking to see your progress!
            </p>
          </div>
        )}
      </div>

      {/* Entry Count Info */}
      {chartData.length > 0 && (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Showing {stats.entries} {stats.entries === 1 ? 'entry' : 'entries'}
          {timeFilter === '30' && ' from the last 30 days'}
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, accent }) => {
  const accentColors = {
    primary: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    rose: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className={clsx('rounded-xl p-2.5', accentColors[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-3 shadow-lg dark:bg-slate-900 dark:border-slate-800">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {data.fullDate}
      </p>
      <p className="mt-1 text-sm font-semibold text-primary">
        {data.weight} kg
      </p>
    </div>
  );
};

export default Progress;
