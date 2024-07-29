"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ITransaction } from "@/types/bTransaction"

const chartConfig = {
  amount: {
    label: "Amount (€)",
  },
  income: {
    label: "Income (€): ",
    color: "#84cc16",
  },
  outcome: {
    label: "Outcome (€): ",
    color: "#dc2626",
  },
} satisfies ChartConfig


const ChartPie = ({ txList } : { txList: ITransaction[] }) => {

  const totalSpend = React.useMemo(() => {
    return txList.reduce((acc, tx) => acc + tx.AmountEUR, 0)
  }, [txList])

  const data = txList.reduce((acc, transaction) => {
    if (transaction.AmountEUR > 0) {
      acc.income += transaction.AmountEUR;
    } else if (transaction.AmountEUR < 0) {
      acc.outcome += -transaction.AmountEUR;
    }
    return acc;
  }, { income: 0, outcome: 0 });
  
  const formattedResult = [
    { type: 'income', amount: data.income, fill: 'hsl(var(--chart-2))' },
    { type: 'outcome', amount: data.outcome, fill: 'hsl(var(--chart-1))' }
  ];
  
  return (
    <Card className="flex flex-col border-2 rounded basis-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Account PNL (Global)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] w-[350px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={formattedResult}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold">
                          {totalSpend.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          (EUR)
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartPie;