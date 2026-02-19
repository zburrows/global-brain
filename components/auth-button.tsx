"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LogoutButton } from "./logout-button";
import { LoginForm } from "./login-form";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"

export default function AuthButton() {
  const [user, setUser] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          setUser(!!data.user);
        }
      } catch (error) {
        if (mounted) {
          setUser(false);
        }
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          if (event === "SIGNED_IN") {
            setUser(true);
          } else if (event === "SIGNED_OUT") {
            setUser(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  // Show nothing while loading auth state
  if (user === null) {
    return (<Button className="w-19"></Button>);
  }

  if (!user) {
    return (
      <Popover>
        <PopoverTrigger>
          <Button>
            Log In
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 rounded-2xl">
          <LoginForm/>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <LogoutButton/>
  );
}