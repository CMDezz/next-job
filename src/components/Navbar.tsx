import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo.png";
import { Button } from "./ui/button";
export default function Navbar() {
  return (
    <header>
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href={"/"} className="flex items-center gap-3">
          <Image src={Logo} width={40} height={40} alt="Flow Jobs logo" />
          <span className="text-xl font-bold tracking-tight">Flow Jobs</span>
        </Link>
        <Button asChild>
          <Link href="/jobs/new">Post a job</Link>
        </Button>
      </nav>
    </header>
  );
}
