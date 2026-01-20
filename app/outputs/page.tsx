"use client";
import "../globals.css";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { Search, List, LayoutGrid } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { columns, Paper } from "./columns";
import { DataTable } from "./data-table";
import {
  pillars,
  subpillars,
  solutions,
  subcategories,
  solutionsData,
} from "@/components/config/taxonomy-config"
subpillars.shift();
solutions.shift();
subcategories.shift();
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PaperDialog from "@/components/paper-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaperEntry {
  id: string;
  authors: string;
  title: string;
  link: string;
  author1: string;
  author2: string;
  organization: string;
  year: number;
  journal: string;
  pillar: string;
  subpillar: string;
  solution: string;
  subcategory: string;
  tags: string[];
  keyFindings: string;
  metaDescription: string;
  onePageSummary: string;
  [key: string]: any;
}

export default function Page() {
  const [papers, setPapers] = useState<PaperEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperEntry | null>(null);
  const [listView, setListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [cardPage, setCardPage] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [sortBy, setSortBy] = useState<"title" | "recent" | "date">("recent");  
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [selectedSubpillar, setSelectedSubpillar] = useState<string>("all");
  const [selectedSolution, setSelectedSolution] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [subpillarOptions, setSubpillarOptions] = useState(subpillars);
  const [solutionOptions, setSolutionOptions] = useState(solutions);
  const [subcategoryOptions, setSubcategoryOptions] = useState(subcategories);
  const setGeneralSelection = (selection: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (pillars.includes(selection)) {
      setSelectedPillar(selection);
    }
    else if (subpillars.includes(selection)) {
      setSelectedSubpillar(selection);
    }
    else if (solutions.includes(selection)) {
      setSelectedSolution(selection);
    }
    else if (subcategories.includes(selection)) {
      setSelectedSubcategory(selection);
    }
  };
  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { data, error: supabaseError } = await supabase
        .from("GlobalBrain")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setPapers(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch papers");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort papers
  const filteredAndSortedPapers = useMemo(() => {
    let filtered = papers;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (paper) =>
          paper.title?.toLowerCase().includes(query) ||
          paper.authors?.toLowerCase().includes(query) ||
          paper.keyFindings?.toLowerCase().includes(query) ||
          paper.metaDescription?.toLowerCase().includes(query)
      );
    }

    // Filter by solution/category
    if (selectedPillar !== "all") {
      filtered = filtered.filter((paper) => paper.pillar === selectedPillar);
    }
    if (selectedSubpillar !== "all") {
      filtered = filtered.filter((paper) => paper.subpillar === selectedSubpillar);
    }
    if (selectedSolution !== "all") {
      filtered = filtered.filter((paper) => paper.solution === selectedSolution);
    }
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((paper) => paper.subcategory === selectedSubcategory);
    }

    // Sort papers
    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "recent") {
      // Already ordered by created_at DESC from database
      sorted.sort((a, b) => {
        const aDate = new Date(a.created_at || 0).getTime();
        const bDate = new Date(b.created_at || 0).getTime();
        return bDate - aDate;
      });
    } else if (sortBy === "date") {
      // Already ordered by created_at DESC from database
      sorted.sort((a, b) => {
        return b.year - a.year;
      });
    }
    return sorted;
  }, [papers, searchQuery, sortBy, selectedPillar, selectedSubpillar, selectedSolution, selectedSubcategory]);

  const chunkedPapers = useMemo(() => {
    var chunked = [];
    var j = 0;
    for (let i = 0; i < Math.ceil(filteredAndSortedPapers.length / Number(pageSize)); i++) {
      chunked.push(filteredAndSortedPapers.slice(j, j + Number(pageSize)));
      j += Number(pageSize);
    }
    setNumPages(Math.ceil(filteredAndSortedPapers.length / Number(pageSize)));
    return chunked;
  }, [filteredAndSortedPapers, pageSize]);
  return (
    <main>
      <h1>Explore papers</h1>
      <div className="flex justify-center">
        <p className="p-3 text-muted-foreground">
          Browse papers and research entries
        </p>
      </div>
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          Error loading papers: {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex justify-center">
      <div className="flex flex-col w-5xl gap-4 bg-card p-3 rounded-lg border">
        <div className="flex space-x-4 align-middle">
          <div className="lg:w-3/4 sm:w-1/4 md:w-1/4">
        <InputGroup>
          <InputGroupInput 
            placeholder="Search by title, authors, findings, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
          </div>
          
          <div className="flex-1">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "title" | "recent")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
            <SelectItem value="date">Publication Date</SelectItem>
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
            <Select value={pageSize} onValueChange={(value) => {
              setPageSize(value);
              setCardPage(0);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select page size"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 results</SelectItem>
                <SelectItem value="20">20 results</SelectItem>
                <SelectItem value="50">50 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-initial">
            <ButtonGroup>
              <Button variant="outline" onClick={() => setListView(true)}><List/></Button>
              <Button variant="outline" onClick={() => setListView(false)}><LayoutGrid/></Button>
            </ButtonGroup>
          </div>
        </div>
        <Separator />
        <div className="flex space-x-4">
          <div className="flex-1">
        <Select value={selectedPillar} onValueChange={(value: string)=>{
          setSelectedPillar(value);
          var subpillarOpts: string[] = [];
          var solutionOpts: string[] = [];
          var subcategoryOpts: string[] = [];
          if (value == "all") {
            subpillarOpts = subpillars;
            solutionOpts = solutions;
            subcategoryOpts = subcategories;
          }
          else {
            for (const subpillar in solutionsData[value]) {
              subpillarOpts.push(subpillar);
              for (const solution in solutionsData[value][subpillar]) {
                solutionOpts.push(solution);
                for (const subcategory of solutionsData[value][subpillar][solution]) {
                  subcategoryOpts.push(subcategory);
                }
              }
            }
          }
          setSubpillarOptions(subpillarOpts);
          setSolutionOptions(solutionOpts);
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSubpillar("all");
          setSelectedSolution("all");
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by pillar" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="all">All Pillars</SelectItem>
            {pillars.map((pillar) => (
          <SelectItem key={pillar} value={pillar}>
            {pillar}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSubpillar} onValueChange={(value:string)=>{
          setSelectedSubpillar(value);
          var solutionOpts: string[] = [];
          var subcategoryOpts: string[] = [];
          var pillar = selectedPillar;
          if (value == "all") {
            solutionOpts = solutions;
            subcategoryOpts = subcategories;
          }
          else {
            if (selectedPillar == "all") {
              for (const pil in solutionsData) {
                if (value in solutionsData[pil]) {
                  pillar = pil;
                }
              }
            }
            for (const sol in solutionsData[pillar][value]) {
              solutionOpts.push(sol);
              for (const subcategory of solutionsData[pillar][value][sol]) {
                subcategoryOpts.push(subcategory);
              }
            }
          }
          setSolutionOptions(solutionOpts);
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSolution("all");
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by subpillar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subpillars</SelectItem>
            {subpillarOptions.map((subpillar) => (
          <SelectItem key={subpillar} value={subpillar}>
            {subpillar}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSolution} onValueChange={(value:string)=>{
          setSelectedSolution(value);
          var subcategoryOpts: string[] = [];
          var pillar = selectedPillar;
          var subpillar = selectedSubpillar;
          if (value == "all") {
            subcategoryOpts = subcategories;
          }
          else {
            if (selectedPillar == "all" && selectedSubpillar != "all") { // figure out what the pillar is
              for (const pil in solutionsData) {
                if (selectedSubpillar in solutionsData[pil]) {
                  pillar = pil;
                  continue;
                }
              }
            }
            else if (selectedPillar != "all" && selectedSubpillar == "all") { // figure out what the subpillar is
              for (const sp in solutionsData[selectedPillar]) {
                if (value in solutionsData[selectedPillar][sp]) {
                  subpillar = sp;
                  continue;
                }
              }
            }
            else if (selectedPillar == selectedSubpillar) { //figure out what the subpillar and pillar are
              for (const pil in solutionsData) {
                for (const sp in solutionsData[pil]) {
                  if (value in solutionsData[pil][sp]) {
                    pillar = pil;
                    subpillar = sp;
                    continue;
                  }
                }
              }
            }
            for (const subcategory of solutionsData[pillar][subpillar][value]) {
              subcategoryOpts.push(subcategory);
            }
          }
          setSubcategoryOptions(subcategoryOpts);
          setSelectedSubcategory("all");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by solution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Solutions</SelectItem>
            {solutionOptions.map((solution) => (
          <SelectItem key={solution} value={solution}>
            {solution}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
          <div className="flex-1">
        <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {subcategoryOptions.map((subcategory) => (
          <SelectItem key={subcategory} value={subcategory}>
            {subcategory}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
        </div>
      </div>
      </div>
    <div className="p-6 max-w-7/8 mx-auto">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-full h-[16rem]">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedPapers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {papers.length === 0
              ? "No papers found in the database yet."
              : "No papers match your search or filter criteria."}
          </p>
        </div>
      ) : listView == true? (
          <DataTable
            columns={columns}
            data={filteredAndSortedPapers}
            pageSize={Number(pageSize)}
            rowWrapper={(paper, rowElem) => (
              <PaperDialog key={paper.id} paper={paper} listView={listView}>{rowElem}</PaperDialog>
            )}
          />
        
      ) : (
        <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(chunkedPapers[cardPage]).map((paper) => (
            <PaperDialog key={paper.id} paper={paper} listView={listView}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPaper(paper)}
              >
                <CardHeader className="">
                  <CardTitle className="line-clamp-2 h-[2.15rem]">
                    {paper.title || "Untitled"}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {`${paper.authors || "Unknown authors"} (${paper.year})`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3 overflow-hidden">
                    {paper.metaDescription.slice(0, paper.metaDescription.lastIndexOf("(")) || "No description available"}
                  </p>
                </CardContent>
                <CardFooter className="content-end flex-wrap gap-3">
                  {paper.tags.map((tag) => (
                    <Button key={tag} className="rounded-full text-xs text-muted-foreground" variant="outline" size="sm" onClick={(event) => {
                      event.stopPropagation();
                      setGeneralSelection(tag, event);
                    }}>
                      {tag}
                    </Button>
                  ))}
                </CardFooter>
              </Card>
            </PaperDialog>
          ))}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCardPage(cardPage - 1)}
            disabled={cardPage == 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCardPage(cardPage + 1)}
            disabled={cardPage == numPages - 1}
          >
            Next
          </Button>
        </div>
        </div>
      )}
      </div>
    </main>
  );
}