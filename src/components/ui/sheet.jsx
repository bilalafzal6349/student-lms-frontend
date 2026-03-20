/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SheetContext = React.createContext(null);

export const Sheet = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger = ({ children, asChild }) => {
  const { setOpen } = React.useContext(SheetContext);
  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onClick: () => setOpen(true),
    });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
};

export const SheetClose = ({ children, asChild }) => {
  const { setOpen } = React.useContext(SheetContext);
  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onClick: () => setOpen(false),
    });
  }
  return <button onClick={() => setOpen(false)}>{children}</button>;
};

export const SheetContent = ({ children, className, side = "right" }) => {
  const { open, setOpen } = React.useContext(SheetContext);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  // Lock body scroll when open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const slideClass = {
    right: "right-0 top-0 h-full w-72 translate-x-0",
    left: "left-0 top-0 h-full w-72 translate-x-0",
    top: "top-0 left-0 w-full h-auto",
    bottom: "bottom-0 left-0 w-full h-auto",
  }[side];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      {/* Panel */}
      <div
        className={cn(
          "absolute bg-white shadow-xl flex flex-col",
          slideClass,
          className,
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader = ({ children, className }) => (
  <div className={cn("px-6 pt-6 pb-4 border-b border-gray-100", className)}>
    {children}
  </div>
);

export const SheetTitle = ({ children, className }) => (
  <h2 className={cn("text-base font-semibold text-gray-900", className)}>
    {children}
  </h2>
);
