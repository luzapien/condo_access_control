import type { QueryData } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

// Cambiamos la constante por una función constructora
export const getVehiclesWithHousesQuery = () => 
  supabase.from("vehicles").select(`
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
  `);

// Usamos ReturnType para mantener intacto el tipado automático
export type VehiclesWithHouses = QueryData<ReturnType<typeof getVehiclesWithHousesQuery>>;
export type VehicleWithHouse = VehiclesWithHouses[number];
