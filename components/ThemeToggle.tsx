"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border bg-background">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10 border-border bg-background flex-shrink-0"
      onClick={toggleTheme}
      title={`Current Theme: ${theme}. Click to change.`}
    >
      {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />}
      {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />}
      {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem] text-foreground" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
