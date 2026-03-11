import Outcall "http-outcalls/outcall";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

actor {
  let OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
  let MAX_HISTORY_LENGTH = 20;

  type RecipeId = Nat;
  type Recipe = {
    id : RecipeId;
    user : Principal;
    title : Text;
    ingredients : Text;
    instructions : Text;
  };

  var nextRecipeId = 0;
  var recipes : [Recipe] = [];

  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  public shared ({ caller }) func generateRecipe(request : Text) : async Text {
    let structuredText = request;

    let response = await Outcall.httpPostRequest(
      OPENAI_API_URL,
      [],
      structuredText,
      transform,
    );

    let recipe : Recipe = {
      id = nextRecipeId;
      user = caller;
      title = "AI Generated Recipe";
      ingredients = "Dynamic";
      instructions = "Dynamic";
    };

    recipes := [recipe].concat(Array.tabulate<Recipe>(recipes.size(), func(i) { recipes[i] }));

    if (recipes.size() > MAX_HISTORY_LENGTH) {
      recipes := Array.tabulate<Recipe>(
        MAX_HISTORY_LENGTH,
        func(i) {
          if (i < recipes.size()) { recipes[i] } else { recipe };
        },
      );
    };

    nextRecipeId += 1;
    response;
  };

  public query ({ caller }) func getRecentRecipes() : async [(Text, Text)] {
    if (recipes.isEmpty()) { Runtime.trap("No recipes available.") };

    recipes.map(
      func(recipe) {
        (recipe.title, recipe.instructions);
      }
    );
  };

  public shared ({ caller }) func clearHistory() : async () {
    recipes := [];
  };

  public query ({ caller }) func getRecipeById(id : Nat) : async Recipe {
    switch (recipes.values().find(
      func(recipe) {
        recipe.id == id;
      }
    )) {
      case (null) { Runtime.trap("Recipe does not exist") };
      case (?recipe) { recipe };
    };
  };

  public query ({ caller }) func getUserRecipes(user : Principal) : async [Recipe] {
    let filteredRecipes = recipes.values().filter(
      func(recipe) {
        recipe.user == user;
      }
    );
    filteredRecipes.toArray();
  };

  public query ({ caller }) func getAllRecipes() : async [Recipe] {
    recipes;
  };
};
