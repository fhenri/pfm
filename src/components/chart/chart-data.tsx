"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  ChartConfig, 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent } from "@/components/ui/chart"
import ITransaction from "@/types/bTransaction"

const chartConfig = {
  income: {
    label: "Income (€): ",
    //color: "#84cc16",
    color: 'hsl(var(--chart-2))',
  },
  outcome: {
    label: "Outcome (€): ",
    //color: "#dc2626",
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const ChartSample = ({ txList } : { txList: typeof ITransaction[] }) => {

  const data = txList.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.TransactionDate);
    const month: string = transactionDate.getFullYear().toString() 
              + (transactionDate.getMonth() + 1).toString().padStart(2, '0');

    // Find the existing entry for this month
    let entry = acc.find(item => item.month === month);
  
    // If no entry exists for this month, create a new one
    if (!entry) {
      entry = { month: month, income: 0, outcome: 0 };
      acc.push(entry);
    }
  
    // Add to income or outcome based on the Amount
    if (transaction.Amount > 0) {
      entry.income += transaction.AmountEUR;
    } else if (transaction.Amount < 0) {
      entry.outcome += -transaction.AmountEUR;
    }
  
    return acc;
  }, []);
  
  console.log(data);
  return (
    <Card className="border-2 rounded basis-1/2 grow">
      <CardHeader>
        <CardTitle>Account PNL (per month)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer 
            config={chartConfig} 
            className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={data.reverse()}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="outcome" fill="var(--color-outcome)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    )
}

export default ChartSample;