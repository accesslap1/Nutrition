import type {Food,Meal} from './types';
export const foods:Food[]=[
{id:'f1',name:'Greek yogurt & berries',serving:'1 bowl · 280 g',calories:310,protein:24,carbs:38,fat:7},
{id:'f2',name:'Grilled chicken bowl',serving:'1 bowl · 420 g',calories:560,protein:48,carbs:54,fat:17},
{id:'f3',name:'Avocado toast',serving:'2 slices · 210 g',calories:390,protein:13,carbs:44,fat:19},
{id:'f4',name:'Banana',serving:'1 medium · 118 g',calories:105,protein:1,carbs:27,fat:0},
{id:'f5',name:'Salmon & vegetables',serving:'1 plate · 390 g',calories:610,protein:45,carbs:31,fat:32},
{id:'f6',name:'Protein smoothie',serving:'1 glass · 400 ml',calories:340,protein:32,carbs:42,fat:6}];
export const initialMeals:Meal[]=[{...foods[0],mealId:'m1',type:'Breakfast',time:'08:20'},{...foods[1],mealId:'m2',type:'Lunch',time:'13:10'},{...foods[3],mealId:'m3',type:'Snack',time:'16:05'}];
