export type MealType='Breakfast'|'Lunch'|'Dinner'|'Snack';
export type Food={id:string;name:string;serving:string;calories:number;protein:number;carbs:number;fat:number};
export type Meal=Food&{mealId:string;type:MealType;time:string};
