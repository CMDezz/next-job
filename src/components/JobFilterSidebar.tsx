import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/const";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}
interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: {
        approved: true,
      },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              defaultValue={defaultValues.q}
              name="q"
              id="q"
              placeholder="Title, company, etc.."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={defaultValues.type}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Choose job type" />
              </SelectTrigger>
              <SelectContent
                style={{ maxWidth: "var(--radix-select-trigger-width)" }}
              >
                <SelectItem value={"All"} key={"All"}>
                  <span className="line-clamp-1 text-left">All</span>
                </SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem title={type} value={type} key={type}>
                    <span className="line-clamp-1 text-left">{type}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select name="location" defaultValue={defaultValues.location}>
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="Choose location" />
              </SelectTrigger>
              <SelectContent
                style={{ maxWidth: "var(--radix-select-trigger-width)" }}
              >
                <SelectItem value={"All"} key={"All"}>
                  <span className="line-clamp-1 text-left">All</span>
                </SelectItem>
                {distinctLocations.map((location) => (
                  <SelectItem title={location} value={location} key={location}>
                    <span className="line-clamp-1 text-left">{location}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton>Find jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
