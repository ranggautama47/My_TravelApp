import React from "react";
import { dialog as ShadDialog } from "@/Components/ui/dialog";

export default function dialog({ open, onOpenChange, children }) {
  return (
    <ShadDialog open={open} onOpenChange={onOpenChange}>
            {children}
    </ShadDialog>
  );
}

export function DialogContent({ children }) {
    return <div className="p-4 bg-white rounded-lg shadow-sm">{children}</div>;
}

export function DialogHeader({ children }) {
    return <div className="border-b pb-2 mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>;
}
