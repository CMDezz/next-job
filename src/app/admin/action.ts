import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type FormState = { error?: string } | undefined;

export async function approveSubmission(
  formData: FormData,
): Promise<FormState> {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();
    if (!user || !isAdmin(user)) throw new Error("Not authorized!");

    await prisma?.job.update({
      where: {
        id: jobId,
      },
      data: { approved: true },
    });
    revalidatePath("");
  } catch (err) {
    let message = "Unexpected error!";
    if (err instanceof Error) {
      message = err.message;
    }
    return { error: message };
  }
}

export async function deleteJob(formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();
    if (!user || !isAdmin(user)) throw new Error("Not authorized!");

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (job?.companyLogoUrl) {
      //delete image
      // await del
    }

    await prisma.job.delete({ where: { id: jobId } });
    revalidatePath("");
  } catch (err) {
    let message = "Unexpected error!";
    if (err instanceof Error) {
      message = err.message;
    }
    return { error: message };
  }
}
