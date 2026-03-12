import { useSearchParams } from "react-router";
import { AllSeafoodSection } from "./AllSeafoodSection";

export function AllSeafoodPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <AllSeafoodSection fullPage initialCategory={category} initialSearch={search} />
    </div>
  );
}