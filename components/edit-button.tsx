// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function EditButton() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => setUser(data.user));

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   if (!user) return null;

//   return (
//     <div className="p-4 bg-blue-200 rounded">
//       Visible only when logged in (client-side)
//     </div>
//   );
// }