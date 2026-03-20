import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Plain React avatar — no Radix dependency.
 * Supports AvatarImage (with onError fallback) and AvatarFallback.
 */
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(
  ({ className, src, alt = "", onError, ...props }, ref) => {
    const [errored, setErrored] = React.useState(false);

    if (!src || errored) return null;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={() => {
          setErrored(true);
          if (onError) onError();
        }}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-semibold",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
