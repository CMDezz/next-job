"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import LoadingButton from "./LoadingButton";

export default function FormSubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus();
  return <LoadingButton {...props} loading={pending} type="submit" />;
}
