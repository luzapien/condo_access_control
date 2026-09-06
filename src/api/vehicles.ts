import type { QueryData } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

export const vehiclesWithHousesQuery = supabase
  .from("vehicles")
  .select(
    `
          id,
          license_plate,
          brand,
          model,
          color,
          vehicle_type,
          visitor_name,
          created_at,
          houses (
            house_number,
            owner,
            phone
          )
        `,
  )

export type VehiclesWithHouses = QueryData<typeof vehiclesWithHousesQuery>;
export type VehicleWithHouse = VehiclesWithHouses[number]
