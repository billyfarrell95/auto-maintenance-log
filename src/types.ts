export interface Item {
  id: string,
  date: string,
  vehicle: string,
  cost: string,
  description: string,
  shop: string,
  mileage: string,
  memo: string
}

export interface Shop {
  id: string,
  name: string
}

export interface Vehicle {
  id: string,
  name: string
}
