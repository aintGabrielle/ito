import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

const chatBubbleVariants = cva(
  "relative px-4 py-2 rounded-lg max-w-[85%] break-words",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-background",
        ghost: "bg-muted/50 text-muted-foreground",
      },
      position: {
        left: "rounded-tl-none ml-2",
        right: "rounded-tr-none mr-2 self-end",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "left",
    },
  }
);

const ChatBubble = forwardRef(
  (
    {
      className,
      variant,
      position,
      message,
      timestamp,
      avatar,
      username,
      showAvatar = true,
      ...props
    },
    ref
  ) => {
    const isLeft = position === "left";

    return (
      <div
        className={cn(
          "flex gap-2 items-end mb-4",
          isLeft ? "justify-start" : "justify-end"
        )}
      >
        {isLeft && showAvatar && (
          <Avatar className="w-8 h-8">
            <img
              src={avatar || "/images/logo.png"}
              alt={username || "User"}
              className="object-cover"
            />
          </Avatar>
        )}
        <div
          ref={ref}
          className={cn(chatBubbleVariants({ variant, position }), className)}
          {...props}
        >
          {username && (
            <div className="mb-1 text-xs font-medium opacity-70">
              {username}
            </div>
          )}
          <div>{message}</div>
          {timestamp && (
            <div className="mt-1 text-xs text-right opacity-70">
              {timestamp}
            </div>
          )}
        </div>
        {!isLeft && showAvatar && (
          <Avatar className="w-8 h-8">
            <img
              src={avatar || "/placeholder.svg?height=32&width=32"}
              alt={username || "User"}
              className="object-cover"
            />
          </Avatar>
        )}
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";

export { ChatBubble, chatBubbleVariants };
