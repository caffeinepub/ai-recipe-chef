# AI Recipe Chef

## Current State
New project with no existing features.

## Requested Changes (Diff)

### Add
- A recipe request input where users type what they want to cook or bake
- AI-powered recipe generation via HTTP outcalls to an external LLM API (OpenAI)
- Display generated recipe with: title, description, ingredients list, step-by-step instructions, and cooking time/servings
- Recipe history: save past recipes and allow revisiting them
- Category tags (e.g. Breakfast, Dessert, Dinner, Baking, Snack) for quick inspiration
- Loading state while AI generates the recipe

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: HTTP outcall to OpenAI chat completions API to generate recipes based on user input
2. Backend: Store recipe history (last 20 recipes) per session in stable memory
3. Frontend: Search/input bar for recipe requests
4. Frontend: Recipe result card with structured display
5. Frontend: Recipe history sidebar or list
6. Frontend: Quick category suggestion chips
