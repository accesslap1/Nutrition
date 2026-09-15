CREATE TYPE "NutritionMealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

CREATE TABLE "nutrition_foods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "calories_per_100g" DECIMAL(7,2) NOT NULL,
    "protein_per_100g" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "carbs_per_100g" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "fat_per_100g" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "fiber_per_100g" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "sugar_per_100g" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "nutrition_foods_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nutrition_meal_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "meal_type" "NutritionMealType" NOT NULL,
    "quantity_g" DECIMAL(7,2) NOT NULL,
    "calories" DECIMAL(7,2) NOT NULL,
    "protein" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "carbs" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "fat" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "logged_at" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "nutrition_meal_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nutrition_water_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_ml" INTEGER NOT NULL,
    "logged_at" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "nutrition_water_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "nutrition_foods_user_id_name_idx" ON "nutrition_foods"("user_id", "name");
CREATE INDEX "nutrition_meal_logs_user_id_logged_at_meal_type_idx" ON "nutrition_meal_logs"("user_id", "logged_at", "meal_type");
CREATE INDEX "nutrition_meal_logs_food_id_idx" ON "nutrition_meal_logs"("food_id");
CREATE INDEX "nutrition_water_logs_user_id_logged_at_idx" ON "nutrition_water_logs"("user_id", "logged_at");

ALTER TABLE "nutrition_foods" ADD CONSTRAINT "nutrition_foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "nutrition_meal_logs" ADD CONSTRAINT "nutrition_meal_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nutrition_meal_logs" ADD CONSTRAINT "nutrition_meal_logs_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "nutrition_foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "nutrition_water_logs" ADD CONSTRAINT "nutrition_water_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
