import { Item } from "../../types"

export const trimInput = (item: Item) => {
    const trimmedInput = {
        ...item,
        cost: item.cost.trim(),
        description: item.description.trim(),
        shop: item.shop || "none",
        mileage: item.mileage.trim(),
        memo: item.memo.trim(),
    }
    return trimmedInput
}