"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { Column } from "@tanstack/react-table";
import { ITransaction } from '@/types/bTransaction';
import { IAccount, instanceOfAccount } from '@/types/bAccount';
import { Check, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"


const OptionsCommand = ({ options, selectedValues, column, facets }) => {

    if (options && options.length > 0 && options[0] instanceof Object) {
        return(options.map((option) => {
                   const isSelected = selectedValues.has(option.accountNumber)
                   return (
                     <CommandItem
                       key={option.accountNumber}
                       onSelect={() => {
                         if (isSelected) {
                           selectedValues.delete(option.accountNumber)
                         } else {
                           selectedValues.add(option.accountNumber)
                         }
                         const filterValues = Array.from(selectedValues)
                         column?.setFilterValue(
                           filterValues.length ? filterValues : undefined
                         )
                       }}>
                       <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                               isSelected
                                 ? "bg-primary text-primary-foreground"
                                 : "opacity-50 [&_svg]:invisible")}>
                         <Check className={cn("h-4 w-4")} />
                       </div>
                       <span>{option.bankName} - {option.accountNumber} ({option.currency})</span>
                       {facets?.get(option.accountNumber) && (
                         <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                           {facets.get(option.accountNumber)}
                         </span>
                       )}
                     </CommandItem>
                   )
                 })
        )
    } else {
        return(options.map((option) => {
                   const isSelected = selectedValues.has(option)
                   return (
                     <CommandItem
                       key={option}
                       onSelect={() => {
                         if (isSelected) {
                           selectedValues.delete(option)
                         } else {
                           selectedValues.add(option)
                         }
                         const filterValues = Array.from(selectedValues)
                         column?.setFilterValue(
                           filterValues.length ? filterValues : undefined
                         )
                       }}>
                       <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                               isSelected
                                 ? "bg-primary text-primary-foreground"
                                 : "opacity-50 [&_svg]:invisible")}>
                         <Check className={cn("h-4 w-4")} />
                       </div>
                       <span>{option}</span>
                       {facets?.get(option) && (
                         <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                           {facets.get(option)}
                         </span>
                       )}
                     </CommandItem>
                   )
                 })
        )
    }
}

const OptionBadge = ({ options, selectedValues }) => {

    if (options && options.length > 0 && options[0] instanceof Object) {
        return(options
                .filter((option) => selectedValues.has(option.accountNumber))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.accountNumber}
                    className="rounded-sm px-1 font-normal">
                    {option.accountNumber}
                  </Badge>
                )));
    } else {
        return(options
                .filter((option) => selectedValues.has(option))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option}
                    className="rounded-sm px-1 font-normal">
                    {option}
                  </Badge>
                )));
    }
}

export function DataTableFacetedFilter({
  column,
  title,
  options,
}: {
  column: Column<ITransaction>;
  title: string;
  options: string[] | IAccount[];
}) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue())

  let popClassWidth = "w-[200px] p-0"
  if (options && options.length > 0 && options[0] instanceof Object) {
      popClassWidth = "w-[300px] p-0"
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 xl:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  <OptionBadge options={options} selectedValues={selectedValues} />
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={popClassWidth} align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <OptionsCommand
                options={options}
                selectedValues={selectedValues}
                column={column}
                facets={facets}/>
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}