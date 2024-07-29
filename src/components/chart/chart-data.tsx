"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { 
  ChartConfig, 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", income: 186, outcome: 80 },
  { month: "February", income: 305, outcome: 200 },
  { month: "March", income: 237, outcome: 120 },
  { month: "April", income: 73, outcome: 190 },
  { month: "May", income: 209, outcome: 130 },
  { month: "June", income: 214, outcome: 140 },
]

const chartConfig = {
  income: {
    label: "Revenue",
    color: "#2563eb",
  },
  outcome: {
    label: "Spend",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const ChartSample = ({ txList } : { txList: ITransaction[] }) => {

  return (
    <ChartContainer 
        config={chartConfig} 
        className="min-h-[350px] w-1/2 border-2 rounded basis-1/2 grow">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="outcome" fill="var(--color-outcome)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export default ChartSample;