import React from "react";
import prisma from "@/lib/prisma";
import JobListItem from "./JobListItem";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";

interface JobResultProps {
  filterValue: JobFilterValues;
}

export default async function JobResult({
  filterValue: { q, type, location, remote },
}: JobResultProps) {
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          {
            title: {
              search: searchString,
            },
            type: {
              search: searchString,
            },
            companyName: {
              search: searchString,
            },
            location: {
              search: searchString,
            },
            locationType: {
              search: searchString,
            },
          },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type && type !== "All" ? { type } : {},
      location && location !== "All" ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };
  const jobs = await prisma.job.findMany({
    where: where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.slug}`} key={job.id} className="block">
          <JobListItem job={job} key={job.id} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filters
        </p>
      )}
    </div>
  );
}
