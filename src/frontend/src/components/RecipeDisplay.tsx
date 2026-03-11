import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Clock, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

interface RecipeDisplayProps {
  recipe: string;
  request: string;
}

function parseRecipeText(text: string): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={key++}
          className="text-xl font-display font-semibold mt-6 mb-3 text-foreground flex items-center gap-2"
        >
          {line.replace(/^## /, "")}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h1
          key={key++}
          className="text-3xl font-display font-bold mb-4 text-foreground leading-tight"
        >
          {line.replace(/^# /, "")}
        </h1>,
      );
    } else if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={key++}
          className="text-lg font-display font-semibold mt-4 mb-2 text-foreground"
        >
          {line.replace(/^### /, "")}
        </h3>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        items.push(lines[i].trim().replace(/^[-*] /, ""));
        i++;
      }
      const listKey = key++;
      nodes.push(
        <ul key={listKey} className="space-y-1.5 mb-4 pl-0 list-none">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-foreground/80"
            >
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">
                →
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      const olKey = key++;
      nodes.push(
        <ol key={olKey} className="space-y-2 mb-4 pl-0 list-none">
          {items.map((item, stepNum) => (
            <li
              key={item}
              className="flex items-start gap-3 text-foreground/80"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                {stepNum + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    } else if (line.startsWith("**") && line.endsWith("**")) {
      nodes.push(
        <p key={key++} className="font-semibold text-foreground mb-2">
          {line.replace(/\*\*/g, "")}
        </p>,
      );
    } else if (line === "---" || line === "***") {
      nodes.push(<hr key={key++} className="border-border my-5" />);
    } else {
      nodes.push(
        <p key={key++} className="mb-3 leading-relaxed text-foreground/80">
          {line}
        </p>,
      );
    }
    i++;
  }
  return nodes;
}

export function RecipeDisplay({ recipe, request }: RecipeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      data-ocid="recipe.result.card"
    >
      <Card className="overflow-hidden shadow-warm-lg border-border/60">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-body">
                Your Recipe
              </p>
              <p className="text-primary-foreground font-display font-semibold capitalize">
                {request}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-primary-foreground/60">
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>AI Generated</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Full Recipe</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          <div className="max-w-none">{parseRecipeText(recipe)}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
