'use client';

import React, { useEffect, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ICategory } from '@/types/txCategory';
import { ITransaction } from '@/types/bTransaction';

interface AnalyticsData {
  month: string;
  [key: string]: number;
}

const AnalyticsChart = ({ txList, categories } : { txList: ITransaction[], categories: ICategory[] }) => {

  const [selectCategory, setSelectCategory] = useState("maison");
  const [data, setData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    const data = txList.reduce((acc: { [key: string]: any }, transaction) => {
      const transactionDate = new Date(transaction.TransactionDate);
      const month: string = transactionDate.getFullYear().toString() 
                + (transactionDate.getMonth() + 1).toString().padStart(2, '0');
      const categories = transaction.Categories;
      const amount = transaction.AmountEUR > 0 ? 
                transaction.AmountEUR : 
                -transaction.AmountEUR;
    
      // Ensure an entry exists for the month
      if (!acc[month]) {
        acc[month] = { month };
      }
    
      categories.forEach(category => {
        // Ensure an entry exists for the category within the month
        if (!acc[month][category]) {
          acc[month][category] = 0;
        }
        // Add the amount to the category
        acc[month][category] += amount;
      });
    
      return acc;
    }, {});
    
    // Convert the result object into an array
    setData(Object.values(data));
  }, [txList]);


  return (
    <>
      <Card className="basis-full">
        <CardHeader className="inline-flex flex-row space-x-2 space-y-0">
          <CardTitle className="content-center">
            Spend (€) by Category
          </CardTitle>
          <CardDescription>
            <Select onValueChange={setSelectCategory} defaultValue="maison">
              <SelectTrigger className="w-96 h-8">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem 
                        key={category.CategoryName} 
                        value={category.CategoryName}>
                      {category.CategoryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart width={1100} height={300} data={data}>
                <Line type='monotone' 
                      dataKey={selectCategory} 
                      stroke='#8884d8' />
                <CartesianGrid stroke='#ccc' vertical={false} />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AnalyticsChart;
