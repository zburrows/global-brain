"use client"
import { columns, Author } from "./columns"
import { DataTable } from "./data-table"
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useMemo } from "react";

export default function Page() {
  const [papers, setPapers] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        .from("authors")
        .select("author, email");

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

  return (
    <main>
      <h1>Explore people</h1>
      <div className="flex justify-center">
        <p className="p-3 text-muted-foreground">
          Browse published authors and contact information
        </p>
      </div>
      <div className="p-6 max-w-7/8 mx-auto">
        {loading ? (
          <p>loading</p>
          ) : (<DataTable columns={columns} data={papers}/>)}
      </div>
    </main>
  )
}