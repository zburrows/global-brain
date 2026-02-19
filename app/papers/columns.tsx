"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    pillars,
    subpillars,
    solutions,
    subcategories
} from "@/components/config/taxonomy-config"
import { Button } from "@/components/ui/button";
//import setGeneralSelection from "./page";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Paper = {
  title: string
  authors: string
  year: number
  tags: string[]
}

export const columns: ColumnDef<Paper>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: { width: "40%" },
    cell: ({row}) => <div className="whitespace-normal line-clamp-2">{row.getValue("title")}</div>
  },
  {
    accessorKey: "authors",
    header: "Citation",
    meta: { width: "15%" },
    cell: ({row}) => <div className="overflow-hidden text-ellipsis">{row.getValue("authors")}</div>
  },
  {
    accessorKey: "year",
    header: "Year",
    meta: { width: "5%" },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { width: "40%" },
    cell: ({row}) => (row.getValue("tags") as string[]).join(", ")
  }
]