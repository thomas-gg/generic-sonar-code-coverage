export const u = (expr: string, number: number) => {
  // contrived branching logic for code coverage
  switch (expr) {
    case "cat":
      const cat = "cat";
      const result = cat + "1";
      return result;
    case "dog":
      const dog = "dog";
      if (number > 0) return dog;
      else return "dog";
    default:
      return "defaulted";
  }
};
