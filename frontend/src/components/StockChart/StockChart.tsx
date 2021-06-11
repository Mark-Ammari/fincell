import classes from './StockChart.module.css';
import { format, parseISO } from 'date-fns';
import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid
} from 'recharts'

interface StockChartProps {
    data: any
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
    return (
        <div className={classes.StockChart}>
            <ResponsiveContainer
                className={classes.Chart}
                width="100%"
                height="100%"
            >
                <AreaChart
                    data={data}
                >
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e1e1e" stopOpacity={0.4} />
                            <stop offset="75%" stopColor="#1e1e1e" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey="close"
                        stroke="#1e1e1e"
                        fill="url(#color)"
                    />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickCount={12}
                        tickMargin={5}
                        tickFormatter={str => {
                            const date = parseISO(str)
                            console.log(date.getDay())
                            if (date.getDay() % 3 === 0) {
                                return format(date, "MM/dd");
                            }
                            return "";
                        }}
                    />
                    <YAxis
                        dataKey="close"
                        axisLine={false}
                        tickLine={false}
                        tickCount={6}
                        tickMargin={5}
                        domain={[data[0].close/1.1, data[data.length - 1].close]}
                        tickFormatter={number => `$${number.toFixed(1)}`}
                    />
                    <Tooltip />
                    <CartesianGrid opacity={0.25} vertical={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default StockChart;