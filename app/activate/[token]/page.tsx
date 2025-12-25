// User Activation Page
// Route: /activate/[token]
// Public route for user account activation
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ActivationContainer = dynamic(
  () =>
    import("@/modules/auth/components/ActivationContainer").then(
      (mod) => ({ default: mod.ActivationContainer })
    ),
  {
    loading: () => <Loader message="Loading activation form..." />,
    ssr: false,
  }
);

export default function ActivationPage() {
  return <ActivationContainer />;
}

