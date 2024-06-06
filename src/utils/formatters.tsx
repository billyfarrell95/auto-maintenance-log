export const datePickerCurrentDate = () => {
    const today = new Date();

    const year  = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day   = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`
}

export const formatMileage = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatCost = (value: string) => {
    const options = {
        style: 'currency', 
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
    return parseFloat(value).toLocaleString("en-US", options)
}