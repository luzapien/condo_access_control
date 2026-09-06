import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "../../supabase/client";

interface House {
  id: string;
  house_number: string;
  owner: string;
  phone?: string;
}

export default function VisitorRegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);

  const [houseSearchTerm, setHouseSearchTerm] = useState("");
  const [showHouseDropdown, setShowHouseDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    color: "",
    visitorName: "",
    houseId: "",
    houseDisplay: "",
  });

  const fetchHouses = async () => {
    const { data, error } = await supabase
      .from("houses")
      .select("id, house_number, owner")
      .order("house_number", { ascending: true });

    if (error) {
      console.error("Error fetching houses:", error);
    } else {
      setHouses(data);
    }
  };

  const handleOpenModal = async () => {
    setIsOpen(true);
    await fetchHouses();
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "licensePlate" ? value.toUpperCase() : value,
    }));
  };

  const filteredHouses = houses.filter(
    (house) =>
      house.house_number
        .toLowerCase()
        .includes(houseSearchTerm.toLowerCase()) ||
      house.owner.toLowerCase().includes(houseSearchTerm.toLowerCase()),
  );

  const handleSelectHouse = (house: House) => {
    setFormData((prev) => ({
      ...prev,
      houseId: house.id,
      houseDisplay: `Casa ${house.house_number} - ${house.owner}`,
    }));
    setHouseSearchTerm("");
    setShowHouseDropdown(false);
  };

  const handleRegisterVisitor = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!formData.licensePlate || !formData.houseId || !formData.visitorName) {
      toast.error(
        "Por favor llena al menos la placa, el nombre del visitante y selecciona la casa.",
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("vehicles").insert([
      {
        license_plate: formData.licensePlate,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        vehicle_type: "visitor",
        visitor_name: formData.visitorName,
        house_id: formData.houseId,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error al registrar visitante:", error);
      toast.error(
        "Error al registrar. Es posible que la placa ya esté registrada.",
      );
    } else {
      toast.success("¡Visitante registrado con éxito!");
      setFormData({
        licensePlate: "",
        brand: "",
        model: "",
        color: "",
        visitorName: "",
        houseId: "",
        houseDisplay: "",
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="p-3.5 box-border w-full bg-[#344e41] text-white border-none rounded-lg text-base font-bold cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleOpenModal}
      >
        Registrar visitante
      </button>

      {isOpen && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-1000 p-4 box-border">
          <div className="bg-white p-5 rounded-xl w-full max-w-[450px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              Registro de Vehículo de Visitante
            </h3>

            <form
              onSubmit={handleRegisterVisitor}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col flex-1">
                <label className="block text-sm mb-1 font-bold text-[#333]">
                  Número de Placa:
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="Ej. ABC-123"
                  required
                  className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                />
              </div>

              <div className="flex flex-col flex-1">
                <label className="block text-sm mb-1 font-bold text-[#333]">
                  Nombre del Visitante:
                </label>
                <input
                  type="text"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                />
              </div>

              <div className="flex gap-2.5">
                <div className="flex flex-col flex-1">
                  <label className="block text-sm mb-1 font-bold text-[#333]">
                    Marca:
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ej. Nissan"
                    className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block text-sm mb-1 font-bold text-[#333]">
                    Modelo:
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej. Versa"
                    className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <label className="block text-sm mb-1 font-bold text-[#333]">
                  Color:
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej. Blanco"
                  className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                />
              </div>

              {/* Búsqueda de casas */}
              <div className="relative flex flex-col flex-1" ref={dropdownRef}>
                <label className="block text-sm mb-1 font-bold text-[#333]">
                  Casa que visita:
                </label>
                <input
                  type="text"
                  placeholder="Escribe el número de casa o propietario..."
                  value={
                    formData.houseId ? formData.houseDisplay : houseSearchTerm
                  }
                  onChange={(e) => {
                    setHouseSearchTerm(e.target.value);
                    if (formData.houseId) {
                      setFormData((prev) => ({
                        ...prev,
                        houseId: "",
                        houseDisplay: "",
                      }));
                    }
                    setShowHouseDropdown(true);
                  }}
                  onFocus={() => setShowHouseDropdown(true)}
                  className="w-full p-2.5 rounded-md border border-stone-300 box-border text-sm focus:outline-none focus:ring-2 focus:ring-[#344e41]"
                  required={!formData.houseId}
                />

                {showHouseDropdown && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-stone-300 rounded-b-md max-h-37.5 overflow-y-auto list-none p-0 m-0 z-1100 shadow-md">
                    {filteredHouses.length > 0 ? (
                      filteredHouses.map((house) => (
                        <li
                          key={house.id}
                          onClick={() => handleSelectHouse(house)}
                          className="p-2.5 cursor-pointer border-b border-stone-100 text-sm hover:bg-stone-100"
                        >
                          <strong>Casa {house.house_number}</strong> -{" "}
                          {house.owner}
                        </li>
                      ))
                    ) : (
                      <li className="p-2.5 text-stone-400 text-sm">
                        No se encontraron casas
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 p-2.5 text-white bg-stone-500 border-none rounded-md text-sm font-bold cursor-pointer hover:opacity-95 transition-opacity"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 p-2.5 text-white bg-[#344e41] border-none rounded-md text-sm font-bold cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar Visitante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
