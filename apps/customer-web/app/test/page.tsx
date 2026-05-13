"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@zalldi/auth";

export default function TestPage() {
  const [result, setResult] = useState("Testing...");

  useEffect(() => {
    async function test() {
      try {
        const supabase = createBrowserClient();

        // TEST 1: Supabase connection
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        // TEST 2: Database connection
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .limit(1);

        if (authError) {
          setResult("Auth Error: " + authError.message);
          return;
        }

        if (error) {
          setResult("DB Error: " + error.message);
          return;
        }

        setResult("✅ Supabase Connected Successfully");
      } catch (err) {
        setResult("Unexpected Error");
      }
    }

    test();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>{result}</h1>
    </div>
  );
}