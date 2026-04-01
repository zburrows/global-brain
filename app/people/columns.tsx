"use client"

import { ColumnDef } from "@tanstack/react-table"

import * as React from "react"
import { useState, useEffect, useMemo } from "react";
import { Row } from "@tanstack/react-table"
import { SquarePen, Trash2, Save, CircleX } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { pillars, subpillars, solutions, subcategories } from "@/components/config/taxonomy-config"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Author = {
  id: number
  author: string
  email: string
  tags: string[]
  papers: number[]
}

const supabase = createClient()
subpillars.shift()
solutions.shift()
solutions.splice(solutions.indexOf('Biodiversity Loss'), 1)
subcategories.shift()
const allTags = [...pillars, ...subpillars, ...solutions, ...subcategories]

export const useColumns = (auth: boolean | null) => {
  const [editMode, setEditMode] = useState<number | null>(null)
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Author>();
  const onSubmit = async (data: Author) => {
    const {error} = await supabase.from('authors').update({author: data.author, email: data.email, tags: data.tags}).eq('id', editMode)
    if (error) {
      toast.error(error.message, { position: 'bottom-center'})
    }
    else {
      toast.success(`Saved changes to the database`, { position: 'bottom-center'})
    }
    setEditMode(null)
  }
  if (editMode) return [
    {
      accessorKey: "id",
    },
    {
      accessorKey: "author",
      header: "Name",
      meta: { width: "30%" },
      cell: ({row}: {row: Row<Author>}) => {
        if(editMode == row.renderValue('id')) {
          return(<Input {...register('author')} defaultValue={row.getValue('author')}></Input>)
        } else {
          return(row.getValue('author'))
        }
      }
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { width: "18%" },
      cell: ({row}: {row: Row<Author>}) => {
        if(editMode == row.renderValue('id')) {
          return(<Input {...register('email')} defaultValue={row.getValue('email')}></Input>)
        } else {
          return(<a className="no-underline hover:underline overflow-hidden text-ellipsis" href={`mailto:${row.getValue("email")}`} target="_blank" rel="noopener noreferrer">{row.getValue("email")}</a>)
        }
      }
    },
    {
      accessorKey: "tags",
      header: "Tags",
      meta: auth ? { width: "44%" } : { width: "52%" },
      cell: ({row}: {row: Row<Author>}) => {
        if (editMode == row.getValue('id')) {
          const anchor = useComboboxAnchor()
          return (
            <Controller control={control} name='tags' render={({ field }) => (
              <Combobox multiple autoHighlight items={allTags} value={field.value || row.getValue('tags')} onValueChange={field.onChange}>
                <ComboboxChips ref={anchor}>
                  <ComboboxValue>
                    {(values) => (
                      <React.Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}/>
          )
        }
        else {
          if((row.getValue("tags") as string[]).length > 3) {
            return(
              <HoverCard>
                <HoverCardTrigger>
                  <div className="hover:underline overflow-hidden text-ellipsis">
                  {(row.getValue("tags") as string[]).join(", ")}
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
            return (<div className="overflow-hidden text-ellipsis">{(row.getValue("tags") as string[]).join(", ")}</div>)
          }
        }
      }
    },
    {
      accessorKey: "actions",
      header: "Actions",
      meta: { width: "8%" },
      cell: ({row}: {row: Row<Author>}) => {
        const [isDeleting, setIsDeleting] = useState<boolean>(false)
        
        const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
        async function deleteAuthor(author: string) {
          setIsDeleting(true)
          const {error} = await supabase.from('authors').delete().eq('author', author)
          if (error) {
            toast.error(error.message, { position: 'bottom-center'})
          }
          else {
            toast.success(`Removed ${author} from the database`, { position: 'bottom-center'})
          }
          setIsDeleting(false)
          setDeleteOpen(false)
        }
        
        return (
          (editMode == row.getValue('id')) ? (
            <div className="flex gap-2 justify-start mr-2">
              <Button variant="outline" size={"icon-sm"} disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>{isSubmitting ? <Spinner/> : <Save strokeWidth={1.5} size={20}/>}</Button>
              <Button variant="outline" size={"icon-sm"} onClick={()=>{
                setEditMode(null)
                reset()
              }}><CircleX strokeWidth={1.5} size={20}/></Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-start mr-2">
            <Button variant="outline" size={"icon-sm"} onClick={()=>{
              setEditMode(row.getValue('id'))
              reset({author: row.getValue('author'), email: row.getValue('email'), tags: row.getValue('tags'), id: row.getValue('id')})
            }}><SquarePen strokeWidth={1.5} size={20}/></Button>
            <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size={"icon-sm"}><Trash2 strokeWidth={1.5} size={20}/></Button>
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-fit">
                <PopoverHeader>
                  <PopoverTitle className="flex justify-center">Are you sure?</PopoverTitle>
                  <PopoverDescription className="flex justify-center m-1">
                    <Button className="bg-destructive hover:bg-destructive-light" onClick={()=>deleteAuthor(row.getValue('author'))} disabled={isDeleting}>
                      {isDeleting ? <div className="flex items-center"><Spinner/><div className="px-1">Deleting</div></div> : "Delete"}
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
          )
          
        )
      }
    }
  ]
  else return [
    {
      accessorKey: "id",
    },
    {
      accessorKey: "author",
      header: "Name",
      meta: { width: "30%" }
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { width: "18%" },
      cell: ({row}: {row: Row<Author>}) => <div className="overflow-hidden text-ellipsis"><a className="no-underline hover:underline" href={`mailto:${row.getValue("email")}`} target="_blank" rel="noopener noreferrer">{row.getValue("email")}</a></div>
    },
    {
      accessorKey: "tags",
      header: "Tags",
      meta: auth ? { width: "44%" } : { width: "52%" },
      cell: ({row}: {row: Row<Author>}) => {
        if((row.getValue("tags") as string[]).length > 3) {
          return(
            <HoverCard>
              <HoverCardTrigger>
                <div className="hover:underline overflow-hidden text-ellipsis">
                {(row.getValue("tags") as string[]).join(", ")}
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
          return (<div className="overflow-hidden text-ellipsis">{(row.getValue("tags") as string[]).slice(0,3).join(", ")}</div>)
        }
        
      }
    },
    ...(auth ? [{
      accessorKey: "actions",
      header: "Actions",
      meta: { width: "8%" },
      minSize: 50,
      cell: ({row}: {row: Row<Author>}) => {
        const [isDeleting, setIsDeleting] = useState<boolean>(false)
        const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
        async function deleteAuthor(author: string) {
          setIsDeleting(true)
          const {error} = await supabase.from('authors').delete().eq('author', author)
          if (error) {
            toast.error(error.message, { position: 'bottom-center'})
          }
          else {
            toast.success(`Removed ${author} from the database`, { position: 'bottom-center'})
          }
          setIsDeleting(false)
          setDeleteOpen(false)
        }
        return (
          <div className="flex gap-2 justify-start">
            <Button variant="outline" size={"icon-sm"} onClick={()=>setEditMode(row.getValue('id'))}><SquarePen strokeWidth={1.5} size={20}/></Button>
            <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size={"icon-sm"} onClick={()=>console.log('clicked')}><Trash2 strokeWidth={1.5} size={20}/></Button>
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-fit">
                <PopoverHeader>
                  <PopoverTitle className="flex justify-center">Are you sure?</PopoverTitle>
                  <PopoverDescription className="flex justify-center m-1">
                    <Button className="bg-destructive hover:bg-destructive-light" onClick={()=>deleteAuthor(row.getValue('author'))} disabled={isDeleting}>
                      {isDeleting ? <div className="flex items-center"><Spinner/><div className="px-1">Deleting</div></div> : "Delete"}
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
        )
      }
    }] : [])
  ]
}