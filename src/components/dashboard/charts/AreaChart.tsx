'use client';

import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface AreaChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  description?: string;
}

export function AreaChart({ data, title, description }: AreaChartProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip
              content={({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 border border-gray-800 p-2 rounded-lg shadow-lg">
                      <p className="text-gray-400 text-sm">{label}</p>
                      <p className="text-white font-medium">
                        {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 