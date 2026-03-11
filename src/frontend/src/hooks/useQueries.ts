import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetRecentRecipes() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ["recentRecipes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateRecipe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateRecipe(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentRecipes"] });
    },
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.clearHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentRecipes"] });
    },
  });
}
