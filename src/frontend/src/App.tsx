import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  ChefHat,
  History,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { RecipeDisplay } from "./components/RecipeDisplay";
import {
  useClearHistory,
  useGenerateRecipe,
  useGetRecentRecipes,
} from "./hooks/useQueries";

const SUGGESTIONS = [
  { label: "🍫 Chocolate Lava Cake", value: "chocolate lava cake" },
  { label: "🍝 Pasta Carbonara", value: "pasta carbonara" },
  { label: "🍌 Banana Bread", value: "banana bread" },
  { label: "🍗 Chicken Stir Fry", value: "spicy chicken stir fry" },
  { label: "🥞 Fluffy Pancakes", value: "fluffy buttermilk pancakes" },
  { label: "🌮 Beef Tacos", value: "crispy beef tacos" },
  { label: "🍰 New York Cheesecake", value: "New York style cheesecake" },
  { label: "🥣 Veggie Soup", value: "hearty vegetable soup" },
];

const queryClient = new QueryClient();

function AppContent() {
  const [input, setInput] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState("");

  const { data: recentRecipes, isLoading: historyLoading } =
    useGetRecentRecipes();
  const generateMutation = useGenerateRecipe();
  const clearMutation = useClearHistory();

  const handleGenerate = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setCurrentRequest(trimmed);
    setCurrentRecipe(null);
    try {
      const result = await generateMutation.mutateAsync(trimmed);
      setCurrentRecipe(result);
    } catch {
      toast.error("Failed to generate recipe. Please try again.");
    }
  };

  const handleSuggestion = (value: string) => {
    setInput(value);
  };

  const handleHistoryClick = (request: string, recipe: string) => {
    setInput(request);
    setCurrentRequest(request);
    setCurrentRecipe(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
      setCurrentRecipe(null);
      setCurrentRequest("");
      setInput("");
      toast.success("Recipe history cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              AI Recipe Chef
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Powered by AI</span>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
          <div className="relative container max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-body font-medium mb-4">
                Your Personal Kitchen Companion
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                What shall we
                <br />
                <em className="text-primary not-italic">cook today?</em>
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto font-body">
                Describe any dish you crave — from a simple weeknight pasta to
                an elaborate tasting menu — and get a beautiful, detailed recipe
                instantly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Input Section */}
        <section className="container max-w-4xl mx-auto px-4 -mt-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="shadow-warm-lg border-border/50 overflow-hidden">
              <CardContent className="p-5 md:p-6">
                {/* Suggestions */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-body">
                    Quick Ideas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, idx) => (
                      <button
                        type="button"
                        key={s.value}
                        data-ocid={`recipe.suggestion.item.${idx + 1}`}
                        onClick={() => handleSuggestion(s.value)}
                        className="px-3 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-body cursor-pointer border border-border/40"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-3">
                  <Textarea
                    data-ocid="recipe.search_input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='e.g. "a rich dark chocolate soufflé with raspberry coulis", "crispy Korean fried chicken"...'
                    rows={3}
                    className="resize-none text-base border-border/60 focus:border-primary bg-background/60 font-body placeholder:text-muted-foreground/50"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-body">
                      Press{" "}
                      <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono border border-border">
                        ⌘
                      </kbd>{" "}
                      +{" "}
                      <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono border border-border">
                        Enter
                      </kbd>{" "}
                      to generate
                    </p>
                    <Button
                      data-ocid="recipe.submit_button"
                      onClick={handleGenerate}
                      disabled={!input.trim() || generateMutation.isPending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-body shadow-warm px-6"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Crafting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Recipe
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Result / Loading / Error */}
        <section className="container max-w-4xl mx-auto px-4 pb-8">
          <AnimatePresence mode="wait">
            {generateMutation.isPending && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-ocid="recipe.loading_state"
              >
                <Card className="overflow-hidden shadow-warm border-border/50">
                  <div className="bg-primary/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-24 mb-1.5" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-6 w-1/3 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/3 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {generateMutation.isError && !generateMutation.isPending && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-ocid="recipe.error_state"
              >
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-5 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-destructive font-body">
                        Recipe Generation Failed
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 font-body">
                        Something went wrong while crafting your recipe. The AI
                        might be busy — please try again in a moment.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentRecipe && !generateMutation.isPending && (
              <motion.div key="recipe">
                <RecipeDisplay
                  recipe={currentRecipe}
                  request={currentRequest}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Recipe History */}
        <section className="container max-w-4xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Recent Recipes
              </h2>
            </div>
            {recentRecipes && recentRecipes.length > 0 && (
              <Button
                data-ocid="history.clear_button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={clearMutation.isPending}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear All
              </Button>
            )}
          </div>

          {historyLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : recentRecipes && recentRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentRecipes.map(([request, recipe], idx) => (
                <motion.button
                  type="button"
                  key={request}
                  data-ocid={`recipe.history.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => handleHistoryClick(request, recipe)}
                  className="text-left p-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-warm transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-sm text-foreground capitalize truncate leading-snug">
                        {request}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body leading-relaxed">
                        {recipe.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div
              data-ocid="recipe.history.empty_state"
              className="text-center py-12 rounded-xl border border-dashed border-border/50 bg-muted/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ChefHat className="w-6 h-6 text-primary/60" />
              </div>
              <p className="font-display text-base font-medium text-foreground/60">
                No recipes yet
              </p>
              <p className="text-sm text-muted-foreground mt-1 font-body">
                Your generated recipes will appear here
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/60 py-6">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
