import testVehicles from "../data/testVehicles";
import testShops from "./testShops";

const testData = [
  {
      id: crypto.randomUUID(),
      date: "2024-05-23",
      vehicle: testVehicles[2].name,
      cost: "52.00",
      description: "Oil Change",
      shop: testShops[0].name,
      mileage: "135,000",
      memo: "Checked and topped off all fluids"
  },
  {
      id: crypto.randomUUID(),
      date: "2024-05-02",
      vehicle: testVehicles[0].name,
      cost: "45.00",
      description: "Tire rotation",
      shop: testShops[2].name,
      mileage: "134,500",
      memo: "Front tires showing signs of wear"
  },
  {
      id: crypto.randomUUID(),
      date: "2023-05-02",
      vehicle: testVehicles[1].name,
      cost: "243.00",
      description: "New brakes",
      shop: testShops[1].name,
      mileage: "110,000",
      memo: "Brake pads and rotors replaced"
  },
  {
      id: crypto.randomUUID(),
      date: "2023-12-05",
      vehicle: testVehicles[0].name,
      cost: "123.00",
      description: "Coolant flush",
      shop: testShops[1].name,
      mileage: "115,000",
      memo: "Coolant system inspected for leaks"
  },
  {
      id: crypto.randomUUID(),
      date: "2024-02-28",
      vehicle: testVehicles[2].name,
      cost: "40.12",
      description: "Air filter replacement",
      shop: testShops[0].name,
      mileage: "131,000",
      memo: "Air intake cleaned"
  },
  {
      id: crypto.randomUUID(),
      date: "2023-10-15",
      vehicle: testVehicles[1].name,
      cost: "1254.23",
      description: "Spark plug replacement",
      shop: testShops[1].name,
      mileage: "112,500",
      memo: "Performed engine tune-up"
  }
];

export default testData;
