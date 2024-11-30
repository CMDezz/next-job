import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}
export default function LoadingButton({
  children,
  loading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      className="w-full"
      disabled={props.disabled || loading}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      <span className="item-center flex justify-center gap-1">{children}</span>
    </Button>
  );
}
