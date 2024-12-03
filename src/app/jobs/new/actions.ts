"use server";

import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import { nanoid } from "nanoid";
import path from "path";
import prisma from "@/lib/prisma";
import { uploadFileImage } from "@/lib/server-utils";
export async function CreateJobPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const {
    title,
    companyName,
    locationType,
    salary,
    type,
    applicationEmail,
    applicationUrl,
    companyLogo,
    description,
    location,
  } = createJobSchema.parse(values);

  const slug = `${toSlug(title)}-${nanoid(10)}`;

  let companyLogoUrl: string | undefined = undefined;
  if (companyLogo) {
    // const blob = await put(
    //   `company_logos/${slug}${path.extname(companyLogo.name)}`,
    //   companyLogo,
    //   {
    //     access: "public",
    //     addRandomSuffix: false,
    //   },
    // );
    // companyLogoUrl = blob.url;
    const url = await uploadFileImage(
      `/company_logos/${slug}${path.extname(companyLogo.name)}`,
      companyLogo,
    );
    companyLogoUrl = url;
  }

  return await prisma.job.create({
    data: {
      slug,
      title: title.trim(),
      type,
      companyName: companyName.trim(),
      companyLogoUrl,
      location,
      locationType,
      applicationEmail: applicationEmail?.trim(),
      applicationUrl: applicationUrl?.trim(),
      description: description?.trim(),
      salary: parseInt(salary),
    },
    select: {
      slug: true,
      title: true,
      type: true,
      companyLogoUrl: true,
      companyName: true,
      location: true,
      locationType: true,
      applicationEmail: true,
      applicationUrl: true,
      salary: true,
      description: true,
      approved: false,
    },
  });
}
