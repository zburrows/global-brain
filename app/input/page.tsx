"use client";

import "../globals.css";
import Link from "next/link";
import {
  pillars,
  subpillars,
  solutions,
  subcategories,
  solutionsData
} from "@/components/config/taxonomy-config";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldSeparator,
  FieldError
} from "@/components/ui/field";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useForm } from "react-hook-form"
import { GoogleGenAI } from "@google/genai";
import Firecrawl from '@mendable/firecrawl-js';
import puppeteer from 'puppeteer';
import { createClient } from "@/utils/supabase/client";
import { abstractContents, getPdfContents, getDocxContents, getUrlContents, getEmailContents, getAbstractConfig, pdfConfig, urlConfig, emailConfig, model } from "@/components/config/gemini-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
var mammoth = require("mammoth");
import type { Database } from "@/utils/supabase/index";
import { NextApiRequest } from "next";
interface FormState {
  upload: File[];
  url: string;
  abstract: string;
  submit: boolean;
  errors?: [
    upload?: { message: string },
    abstract?: { message: string },
    submit?: { message: string },
  ];
}
interface FormData {
  authors: string,
  title: string,
  link: string,
  author1: string,
  email1: string,
  author2: string,
  email2: string,
  organization: string,
  year: number,
  journal: string,
  pillar: string,
  subpillar: string | null,
  solution: string | null,
  subcategory: string | null,
  keyFindings: string,
  metaDescription: string,
  onePageSummary: string,
  tags?: string[],
  submit?: boolean,
  errors?: [
    submit?: { message: string },
  ];
}
interface AuthorInsert {
  author: string,
  email: string | null,
  papers: number[],
  tags: string[],
}
const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey });
const supabase = createClient();
var formData: FormData = {
  authors: "",
  title: "",
  link: "",
  author1: "",
  email1: "",
  author2: "",
  email2: "",
  organization: "",
  year: 0,
  journal: "",
  pillar: "General",
  subpillar: "",
  solution: "",
  subcategory: "",
  keyFindings: "",
  metaDescription: "",
  onePageSummary: "",
}
export default function Page() {
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting }, watch, clearErrors } = useForm<FormState>();
  const { register: dialogRegister, handleSubmit: handleDialogSubmit, setError: setDialogError, reset: dialogReset, formState: { errors: dialogErrors, isSubmitting: dialogIsSubmitting } } = useForm<FormData>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [paperTitle, setPaperTitle] = useState("");
  const [metaValue, setMetaValue] = useState("");
  const [pillar, setPillar] = useState("General");
  const [pillarOptions, setPillarOptions] = useState(pillars);
  const [subpillar, setSubpillar] = useState("None");
  const [subpillarOptions, setSubpillarOptions] = useState(subpillars);
  const [solution, setSolution] = useState("None");
  const [solutionOptions, setSolutionOptions] = useState(solutions);
  const [subcategory, setSubcategory] = useState("None");
  const [subcategoryOptions, setSubcategoryOptions] = useState(subcategories);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  const maxMetaLength = 155;
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    })
  }
  const readDocx = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      mammoth.convertToHtml(file)
      .then(function(result: any){
        const html = result.value; // The generated 
        resolve(html);
      })
      .catch(function(error: any) {
        console.error(error);
        reject(new Error(error));
      });
    })
  }
  const onSubmit = async (data: FormState) => {
    dialogReset(); //reset dialog form
    if (!data.abstract && (!data.upload || data.upload.length === 0) && !data.url) { // No input
      setError("submit", {
        message: "Please upload a document, or paste a URL or abstract"
      });
      return;
    }
    else if ((data.abstract && data.upload.length > 0) || (data.abstract && data.url) || (data.upload.length > 0 && data.url)) { // Multiple inputs
      setError("submit", {
        message: "Cannot process multiple form fields"
      });
      return;
    }
    if (!data.abstract && !data.url && data.upload && data.upload.length > 0) { // Document uploaded
      const file = data.upload[0];
      setCurrentFile(file);
      const base64 = await readFileAsDataURL(file);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: (file.type == "application/pdf") ? getPdfContents(base64) : getDocxContents(base64),
          config: pdfConfig,
        });
        if (!response.text) {
          setError("submit", {
            message: "Empty response from model"
          });
          throw new Error("Empty response from model");
        }
        const json = JSON.parse(response.text);
        formData = json[0];
        if (formData.author1) {
          const email1Response = await ai.models.generateContent({ // get emails with a separate API call
            model: model,
            contents: getEmailContents(formData.author1, formData.title),
            config: emailConfig,
          });
          if (email1Response.text) {
            formData.email1 = email1Response.text;
          }
        }
        else {
          formData.email1 = "";
        }
        if (formData.author2) {
          const email2Response = await ai.models.generateContent({ // get emails with a separate API call
            model: model,
            contents: getEmailContents(formData.author2, formData.title),
            config: emailConfig,
          });
          if (email2Response.text) {
            formData.email2 = email2Response.text;
          }
        }
        else {
          formData.email2 = "";
        }
        console.log(formData);
        setMetaValue(formData.metaDescription);
        setPillar(formData.pillar);
        setSubpillar(formData.subpillar!);
        setSolution(formData.solution!);
        setSubcategory(formData.subcategory!);
        var subpillarOpts = ["None"];
        var solutionOpts = ["None"];
        var subcategoryOpts = ["None"];
        if (formData.subpillar != "None") {
          for (const subpillar in solutionsData[formData.pillar]) {
            subpillarOpts.push(subpillar);
          }
        }
        if (formData.solution != "None") {
          for (const solution in solutionsData[formData.pillar][formData.subpillar!]) {
            solutionOpts.push(solution);
          }
        }
        if (formData.subcategory != "None") {
          for (const subcategory of solutionsData[formData.pillar][formData.subpillar!][formData.solution!]) {
            subcategoryOpts.push(subcategory);
          }
        }
        setSubpillarOptions(subpillarOpts);
        setSolutionOptions(solutionOpts);
        setSubcategoryOptions(subcategoryOpts);
        setIsDialogOpen(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("upload", {
          message: `Error: ${error.message}`
        });
          console.error(error.message);
        }
        else {
          setError("upload", {
            message: "Unknown document processing error"
          });
        }
      }
    } else if (data.abstract) { // Abstract entered
      console.log(data.abstract);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: abstractContents,
          config: getAbstractConfig(data.abstract),
        });
        if (!response.text) {
          throw new Error("Empty response from model");
        }
        const json = JSON.parse(response.text);
        formData = json[0];
        console.log(formData);
        setMetaValue(formData.metaDescription);
        setPillar(formData.pillar);
        setSubpillar(formData.subpillar!);
        setSolution(formData.solution!);
        setSubcategory(formData.subcategory!);
        setIsDialogOpen(true);
      } catch (error: unknown) {
        setError("submit", {
            message: "Empty response from model"
          });
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
    else { //URL entered
      // var base64Html = ""
      // try {
      //   const html = await fetch(data.url).then(res => res.text());
      //   base64Html = Buffer.from(html, "utf8").toString("base64");
      // }
      // catch (error: unknown) {
      //   if (error instanceof Error) {
      //     setError("url", {
      //       message: `Error: ${error.message}`
      //     })
      //   }
      //   else {
      //     setError("url", {
      //       message: "Unable to process URL"
      //     })
      //   }
      // }
      //const base64Html = await analyzeUrl(data.url);
      //const firecrawl = new Firecrawl({apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY!});
      // const scrapeResponse = await firecrawl.scrape(data.url, {
      //   formats: ['markdown', 'html', 'rawHtml'],
      // });
      // console.log(scrapeResponse)
      // const browser = await puppeteer.launch({
      //   headless: false, // must be false for clipboard permissions
      // });

      // const page = await browser.newPage();

      // // Allow clipboard read/write permissions
      // const context = browser.defaultBrowserContext();
      // await context.overridePermissions(data.url, [
      //   "clipboard-read",
      //   "clipboard-write",
      // ]);

      // await page.goto(data.url);

      // // OPTIONAL: simulate Ctrl+A / Ctrl+C
      // await page.click("body");
      // await page.keyboard.down("Control");
      // await page.keyboard.press("KeyA");
      // await page.keyboard.press("KeyC");
      // await page.keyboard.up("Control");

      // // Read clipboard content from inside the browser
      // const copiedText = await page.evaluate(async () => {
      //   return await navigator.clipboard.readText();
      // });

      // console.log("Copied text:\n", copiedText);

      // await browser.close();


      // try {
      //   const response = await ai.models.generateContent({
      //     model: model,
      //     contents: getUrlContents(data.url, base64Html),
      //     config: urlConfig,
      //   });
      //   if (!response.text) {
      //     throw new Error("Empty response from model");
      //   }
      //   const json = JSON.parse(response.text);
      //   formData = json[0];
      //   formData.link = data.url;
      //   console.log(formData);
      //   setMetaValue(formData.metaDescription);
      //   //setSolution(formData.solutions);
      //   setIsDialogOpen(true);
      // } catch (error: unknown) {
      //   if (error instanceof Error) {
      //     setError("url", {
      //       message: `Error: ${error.message}`
      //     });
      //   }
      //   else {
      //     setError("url", {
      //       message: "Unknown URL processing error"
      //     })
      //   }
      // }
      const res = await fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });
      const r = await res.json();
      if (r.error) {
        console.log(r.error)
        setError("url", {
          message: r.error
        })
      }
      const htmlString = r.content;
      console.log(htmlString);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: getUrlContents(htmlString),
          config: urlConfig,
        });
        if (!response.text) {
          setError("url", {
            message: "Empty response from model"
          });
          throw new Error("Empty response from model");
        }
        const json = JSON.parse(response.text);
        formData = json[0];
        if (formData.author1) {
          const email1Response = await ai.models.generateContent({ // get emails with a separate API call
            model: model,
            contents: getEmailContents(formData.author1, formData.title),
            config: emailConfig,
          });
          if (email1Response.text) {
            formData.email1 = email1Response.text;
          }
        }
        else {
          formData.email1 = "";
        }
        if (formData.author2) {
          const email2Response = await ai.models.generateContent({ // get emails with a separate API call
            model: model,
            contents: getEmailContents(formData.author2, formData.title),
            config: emailConfig,
          });
          if (email2Response.text) {
            formData.email2 = email2Response.text;
          }
        }
        else {
          formData.email2 = "";
        }
        console.log(formData);
        setMetaValue(formData.metaDescription);
        setPillar(formData.pillar);
        setSubpillar(formData.subpillar!);
        setSolution(formData.solution!);
        setSubcategory(formData.subcategory!);
        var subpillarOpts = ["None"];
        var solutionOpts = ["None"];
        var subcategoryOpts = ["None"];
        if (formData.subpillar != "None") {
          for (const subpillar in solutionsData[formData.pillar]) {
            subpillarOpts.push(subpillar);
          }
        }
        if (formData.solution != "None") {
          for (const solution in solutionsData[formData.pillar][formData.subpillar!]) {
            solutionOpts.push(solution);
          }
        }
        if (formData.subcategory != "None") {
          for (const subcategory of solutionsData[formData.pillar][formData.subpillar!][formData.solution!]) {
            subcategoryOpts.push(subcategory);
          }
        }
        setSubpillarOptions(subpillarOpts);
        setSolutionOptions(solutionOpts);
        setSubcategoryOptions(subcategoryOpts);
        setIsDialogOpen(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("upload", {
          message: `Error: ${error.message}`
        });
          console.error(error.message);
        }
        else {
          setError("upload", {
            message: "Unknown document processing error"
          });
        }
      }
    }
  };
  const onDialogSubmit = async (metadata: FormData) => {
    console.log("submitting");    
    const toInsert: any = { ...metadata };
    console.log(metadata);
    delete toInsert.errors;
    delete toInsert.submit;
    delete toInsert.email1;
    delete toInsert.email2;
    toInsert.pillar = pillar;
    if (subpillar == "None") { toInsert.subpillar = null } else { toInsert.subpillar = subpillar };
    if (solution == "None") { toInsert.solution = null } else { toInsert.solution = solution };
    if (subcategory == "None") { toInsert.subcategory = null } else { toInsert.subcategory = subcategory };
    var tags = [];
    for (const tag of [pillar, subpillar, solution, subcategory]) {
      if (tag != "None") { tags.push(tag) };
    }
    toInsert.tags = tags;
    {currentFile ? (toInsert.file = true) : (toInsert.file = false)};
    setPaperTitle(metadata.title);
    
    const { data: gb_data, error: gb_error } = await supabase.from('GlobalBrain').insert(toInsert).select().single(); // send data to Supabase and return the inserted row
    if(gb_error) {
      setDialogError("submit", {
        message: `Error: ${gb_error.message}`
      });
      return; // Exit early to prevent accessing gb_data when it's null
    }
    
    const { title, author1, email1, author2, email2 } = metadata;
    if (currentFile) { // if document uploaded, add to database
      const path = `${gb_data.id}/${title ? (title.replace(/ /g, "_")) : ("Untitled")}.pdf`;
      const { error: uploadError } = await supabase.storage.from("Documents").upload(path, currentFile); // upload PDF
      if (uploadError) {
        setDialogError("submit", {
          message: `Document upload error: ${uploadError.message}`
        });
        return;
      }
      const { data: urlData } = await supabase.storage.from("Documents").getPublicUrl(path);
      console.log(`public URL: ${urlData.publicUrl}, id: ${gb_data.id}`);
      console.log(`path: ${path}`);

      const { error: fileUrlError } = await supabase.from('GlobalBrain').update({ file: urlData.publicUrl }).eq('id', gb_data.id); // add file url to row
      if (fileUrlError) {
        setDialogError("submit", {
          message: `File URL update error: ${fileUrlError.message}`
        });
        return;
      }
      setCurrentFile(null);
    }
    
    if (metadata.author1) { // add to authors database
      const { data: author1_data, error: author1_error } = await supabase.from('authors').select().eq('author', author1);
      if (author1_data!.length > 0) { // entry already exists for author1
        const newPapers = [...author1_data![0].papers, ...[Number(gb_data.id)]]; // add new paper ids
        var tagsToAdd = new Set(author1_data![0].tags);
        for (const tag of tags) { // add new unique tags
          tagsToAdd.add(tag);
        }
        const { error: paperError } = await supabase.from('authors').update({ papers: newPapers, tags: [...tagsToAdd] }).eq('author', author1); // add new paper id to author
        if (!author1_data![0].email) { // if no email currently exists
          const { error } = await supabase.from('authors').update({ email: metadata.email1 }).eq('author', author1); // add new email to author
        }
      }
      else { // need to create a new entry
        const authorsInsert: AuthorInsert = {
        author: author1,
        email: email1 ? email1 : null,
        papers: [Number(gb_data.id)],
        tags: tags
        };
        const { data, error } = await supabase.from('authors').insert(authorsInsert); // add new entry
      }
    }
    if (metadata.author2) { // add to authors database
      const { data: author2_data, error: author2_error } = await supabase.from('authors').select().eq('author', author2);
      
      if (author2_data!.length > 0) { // entry already exists for author2
        const newPapers = [...author2_data![0].papers, ...[Number(gb_data.id)]]
        var tagsToAdd = new Set(author2_data![0].tags);
        for (const tag of tags) { // add new unique tags
          tagsToAdd.add(tag);
        }
        const { error } = await supabase.from('authors').update({ papers: newPapers, tags: [...tagsToAdd] }).eq('author', author2); // add new paper id to author
        if (!author2_data![0].email) { // if no email currently exists
          const { error } = await supabase.from('authors').update({ email: metadata.email2 }).eq('author', author2); // add new email to author
        }
      }
      else {
        const authorsInsert: AuthorInsert = {
          author: author2,
          email: email2 ? email2 : null,
          papers: [Number(gb_data.id)],
          tags: tags
        };
        const { data, error } = await supabase.from('authors').insert(authorsInsert); // add new entry
      }
    }
    
    setIsDialogOpen(false);
    reset();
    dialogReset();
    setIsAlertOpen(true);
  };
  return (
    <main className="px-4 py-4 sm:px-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl">Add papers to Global Brain</h1>
      <p className="p-3 text-muted-foreground text-sm sm:text-base">Upload a document to automatically categorize and add it to the database. You can also paste an abstract.</p>
      <div className="flex justify-center overflow-x-hidden">
        <form id="form" onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-md">
        <FieldSet className="w-full">
          <FieldGroup>
            <Field className="upload-field">
              <FieldLabel htmlFor="upload">Upload documents</FieldLabel>
              <Input {...register("upload", { onChange: () => clearErrors() })} type="file" accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
              <FieldDescription>
                Supported files: .pdf, .docx
              </FieldDescription>
                {errors.upload && <FieldError errors={[{ message: errors.upload.message }]}/>}
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input {...register("url", { onChange: () => clearErrors() })} placeholder="Paste URL here"/>
              <FieldDescription>
                Paste a URL to an open-access paper
              </FieldDescription>
              {errors.url && <FieldError errors={[{ message: errors.url.message }]}/>}
            </Field>
            <FieldSeparator/>
            <Field>
              <FieldLabel htmlFor="abstract">Abstract</FieldLabel>
              <Textarea {...register("abstract", { onChange: () => clearErrors() })} id="abstract" placeholder="Paste abstract here"/>
              <FieldDescription>
                If the paper is paywalled, paste an abstract to extract info
              </FieldDescription>
              {errors.abstract && <FieldError errors={[{ message: errors.abstract.message }]}/>}
            </Field>
            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? <div className="flex items-center"><Spinner/><div className="px-1">Generating...</div></div> : "Submit"}
              </Button>
              {errors.submit && <FieldError errors={[{ message: errors.submit.message }]}/>}
            </Field>
          </FieldGroup>
        </FieldSet>
        </form>
        <form id="dialog-form" onSubmit={handleDialogSubmit(onDialogSubmit)}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-fit min-w-1/3 h-4/5 w-[95vw] sm:max-w-fit sm:w-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Edit generated metadata</DialogTitle>
                <DialogDescription>
                  Check the generated metadata below for accuracy.
                </DialogDescription>
              </DialogHeader>
              <FieldSet className="overflow-y-scroll p-5 max-h-[calc(100vh-200px)] sm:max-h-none">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input {...dialogRegister("title")} id="title" defaultValue={formData.title}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authors">Citation</FieldLabel>
                    <Input {...dialogRegister("authors")} id="authors" defaultValue={formData.authors}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="author1">Author 1</FieldLabel>
                    <Input {...dialogRegister("author1")} id="author1" defaultValue={formData.author1}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email1">Email</FieldLabel>
                    <Input {...dialogRegister("email1")} id="email1" defaultValue={formData.email1}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="author2">Author 2</FieldLabel>
                    <Input {...dialogRegister("author2")} id="author2" defaultValue={formData.author2}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email2">Email</FieldLabel>
                    <Input {...dialogRegister("email2")} id="email2" defaultValue={formData.email2}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="journal">Journal</FieldLabel>
                    <Input {...dialogRegister("journal")} id="journal" defaultValue={formData.journal}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="organization">Organization</FieldLabel>
                    <Input {...dialogRegister("organization")} id="organization" defaultValue={formData.organization}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="year">Year</FieldLabel>
                    <Input {...dialogRegister("year")} id="year" defaultValue={formData.year} type="number"></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="link">Link</FieldLabel>
                    <Input {...dialogRegister("link")} id="link" defaultValue={formData.link}></Input>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="pillar">Pillar</FieldLabel>
                    <Select value={pillar} onValueChange={(value: string)=>{
                      setPillar(value);
                      var subpillarOpts = ["None"];
                      var solutionOpts = ["None"];
                      var subcategoryOpts = ["None"];
                      for (const subpillar in solutionsData[value]) {
                        subpillarOpts.push(subpillar);
                         for (const solution in solutionsData[value][subpillar]) {
                          solutionOpts.push(solution);
                          for (const subcategory of solutionsData[value][subpillar][solution]) {
                            subcategoryOpts.push(subcategory);
                          }
                        }
                      }
                      setSubpillarOptions(subpillarOpts);
                      setSolutionOptions(solutionOpts);
                      setSubcategoryOptions(subcategoryOpts);
                      setSubpillar("None");
                      setSolution("None");
                      setSubcategory("None");
                      }} {...dialogRegister("pillar")}>
                      <SelectTrigger>
                        <SelectValue id="pillar"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Energy Transition">Energy Transition</SelectItem>
                          <SelectItem value="Nature Conservation">Nature Conservation</SelectItem>
                          <SelectItem value="Regenerative Agriculture">Regenerative Agriculture</SelectItem>
                          <SelectItem value="Disputed Solutions">Disputed Solutions</SelectItem>
                          <SelectItem value="Climate Change">Climate Change</SelectItem>
                          <SelectItem value="Biodiversity Loss">Biodiversity Loss</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="subpillar">Subpillar</FieldLabel>
                    <Select value={subpillar} onValueChange={(value)=> {
                      setSubpillar(value)
                      var solutionOpts = ["None"];
                      var subcategoryOpts = ["None"];
                      for (const solution in solutionsData[pillar][value]) {
                        solutionOpts.push(solution);
                        for (const subcategory of solutionsData[pillar][value][solution]) {
                          subcategoryOpts.push(subcategory);
                        }
                      }
                      setSolutionOptions(solutionOpts);
                      setSubcategoryOptions(subcategoryOpts);
                      setSolution("None");
                      setSubcategory("None");
                      }} {...dialogRegister("subpillar")}>
                      <SelectTrigger>
                        <SelectValue id="subpillar"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {subpillarOptions.map((subpillar) => (
                            <SelectItem key={subpillar} value={subpillar}>
                              {subpillar}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="solution">Solution</FieldLabel>
                    <Select value={solution} onValueChange={(value)=>{
                      setSolution(value);
                      var subcategoryOpts = ["None"];
                      var subpillarToAdd = subpillar;
                      if (subpillar == "None") { // update tree in reverse
                        for (const sp in solutionsData[pillar]) {
                          for (const sol in solutionsData[pillar][sp]) {
                            if (sol == value) {
                              subpillarToAdd = sp;
                              continue;
                            }
                          };
                        };
                      };
                      if (value != "None") {
                        for (const subcategory of solutionsData[pillar][subpillarToAdd][value]) {
                          subcategoryOpts.push(subcategory);
                        }
                      }
                      setSubpillar(subpillarToAdd);
                      setSubcategoryOptions(subcategoryOpts);
                      setSubcategory("None");
                      }} {...dialogRegister("solution")}>
                      <SelectTrigger>
                        <SelectValue id="solution"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {solutionOptions.map((solution) => (
                            <SelectItem key={solution} value={solution}>
                              {solution}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="subcategory">Subcategory</FieldLabel>
                    <Select value={subcategory} onValueChange={(value)=>{
                      setSubcategory(value);
                      var subpillarToAdd = subpillar;
                      var solutionToAdd = solution;
                      var subcategoryOpts: string[] = [];
                      var solutionOpts: string[] = ["None"];
                      if (solution == "None" && subpillar == "None") { // update tree in reverse
                        for (const sp in solutionsData[pillar]) {
                          for (const sol in solutionsData[pillar][sp]) {
                            for (const sc of solutionsData[pillar][sp][sol]) {
                              if (sc == value) {
                                solutionToAdd = sol;
                              }
                            }
                            if (sol == solutionToAdd) {
                              subpillarToAdd = sp;
                              subcategoryOpts = [...["None"], ...solutionsData[pillar][sp][sol]];
                            }
                            if (sp == subpillarToAdd) {
                              solutionOpts.push(sol);
                            }
                          };
                        };
                      };
                      if (solution == "None" && subpillar != "None") {
                        for (const sol in solutionsData[pillar][subpillarToAdd]) {
                          for (const sc of solutionsData[pillar][subpillarToAdd][sol]) {
                            if (sc == value) {
                              solutionToAdd = sol;
                              continue;
                            }
                          }
                        }
                      }
                      setSubpillar(subpillarToAdd);
                      setSolution(solutionToAdd);     
                      setSolutionOptions(solutionOpts);
                      setSubcategoryOptions(subcategoryOpts);
                      }} {...dialogRegister("subcategory")}>
                      <SelectTrigger>
                        <SelectValue id="solution"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {subcategoryOptions.map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="keyFindings">Key Findings</FieldLabel>
                    <Textarea {...dialogRegister("keyFindings")} id="keyFindings" defaultValue={formData.keyFindings}></Textarea>
                  </Field>
                  <Field>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                    <span className={`text-xs ${metaValue.length > maxMetaLength ? "text-destructive" : 'text-muted-foreground'}`}>
                      {metaValue.length}/{maxMetaLength}
                    </span>
                    </div>
                    <Textarea {...dialogRegister("metaDescription")} id="metaDescription" defaultValue={formData.metaDescription} onChange={(e) => setMetaValue(e.target.value)}></Textarea>
                    <FieldDescription>
                      This must be a maximum of 155 characters, including a citation.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="onePageSummary">One-Page Summary</FieldLabel>
                    <Textarea {...dialogRegister("onePageSummary")} id="onePageSummary" defaultValue={formData.onePageSummary}></Textarea>
                  </Field>
                  <FieldSeparator/>
                </FieldGroup>
              </FieldSet>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4">
                <Button type="button" onClick={handleDialogSubmit(onDialogSubmit)} disabled={dialogIsSubmitting} className="w-full sm:w-auto">
                  {dialogIsSubmitting ? <div className="flex items-center"><Spinner/><div className="px-1">Add to database</div></div> : "Add to database"}
                </Button>
                {dialogErrors.submit && <FieldError errors={[{ message: dialogErrors.submit.message }]}/>}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Database updated</AlertDialogTitle>
                <AlertDialogDescription>
                An entry for "{paperTitle}" has been successfully added to GlobalBrain.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Add more papers</AlertDialogCancel>
              <Link href="/papers"><AlertDialogAction>Explore entries</AlertDialogAction></Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
