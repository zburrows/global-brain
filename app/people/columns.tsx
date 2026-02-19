"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Author = {
  author: string
  email: string
  tags: string[]
}

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: "author",
    header: "Name",
    meta: { width: "30%" }
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { width: "20%" },
    cell: ({row}) => <a className="no-underline hover:underline" href={`mailto:${row.getValue("email")}`} target="_blank" rel="noopener noreferrer">{row.getValue("email")}</a>
  },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: { width: "50%" },
    cell: ({row}) => {
      if((row.getValue("tags") as string[]).length > 4) {
        return(
          <HoverCard>
            <HoverCardTrigger>
              <div className="hover:underline">
              {(row.getValue("tags") as string[]).slice(0,4).join(", ") + "..."}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="text-sm">
              {(row.getValue("tags") as string[]).join(", ")}
              </div>
            </HoverCardContent>
          </HoverCard>
        )
      }
      else {
        return (row.getValue("tags") as string[]).slice(0,4).join(", ")
      }
      
    }
  }
]