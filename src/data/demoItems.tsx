import demoVehicles from "./demoVehicles";
import demoShops from "./demoShops";

const demoItems = [
  {
      id: crypto.randomUUID(),
      date: "2024-05-23",
      vehicle: demoVehicles[1].name,
      cost: "52.00",
      description: "Oil Change",
      shop: demoShops[0].name,
      mileage: "135,000",
      memo: "Rotate and balance tires"
  },
  {
      id: crypto.randomUUID(),
      date: "2024-05-02",
      vehicle: demoVehicles[0].name,
      cost: "45.00",
      description: "Tire rotation",
      shop: demoShops[1].name,
      mileage: "134,500",
      memo: "Front tires showing signs of wear"
  },
  {
      id: crypto.randomUUID(),
      date: "2023-05-02",
      vehicle: demoVehicles[1].name,
      cost: "243.00",
      description: "New brakes",
      shop: demoShops[1].name,
      mileage: "110,000",
      memo: "Had rotors machined, will need new rotors next time."
  },
  {
      id: crypto.randomUUID(),
      date: "2023-12-05",
      vehicle: demoVehicles[0].name,
      cost: "123.00",
      description: "Coolant flush",
      shop: demoShops[1].name,
      mileage: "115,000",
      memo: "Coolant system inspected for leaks"
  },
  {
      id: crypto.randomUUID(),
      date: "2024-02-28",
      vehicle: demoVehicles[1].name,
      cost: "40.12",
      description: "Air filter replacement",
      shop: demoShops[2].name,
      mileage: "131,000",
      memo: ""
  },
  {
      id: crypto.randomUUID(),
      date: "2023-10-15",
      vehicle: demoVehicles[1].name,
      cost: "1254.23",
      description: "Spark plug replacement",
      shop: demoShops[1].name,
      mileage: "112,500",
      memo: "Performed engine tune-up"
  }
];

export default demoItems;
