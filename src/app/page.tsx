import JobFilterSidebar from "@/components/JobFilterSidebar";
import H1 from "@/components/ui/h1";
import JobResult from "@/components/JobResult";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
  }>;
}
function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type && type !== "All"
      ? `${type} developer jobs`
      : remote
        ? `Remote developer jobs`
        : "All developer jobs";

  const titleSuffix = location && location !== "All" ? ` in ${location}` : "";
  return `${titlePrefix}${titleSuffix}`;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q, type, location, remote } = await searchParams;
  return {
    title: `${getTitle({ q, type, location, remote: remote === "true" })} |  Flow Jobs`,
  };
}
export default async function Home({ searchParams }: PageProps) {
  const { q, type, location, remote } = await searchParams;
  const filterValues: JobFilterValues = {
    location,
    q,
    type,
    remote: remote === "true",
  };
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Find Your dream job</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResult filterValue={filterValues} />
      </section>
    </main>
  );
}
