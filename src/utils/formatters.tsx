export const datePickerCurrentDate = () => {
    const today = new Date();

    const year  = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day   = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`
}

export const formatDate = (dateString: string) => {
    let formattedDate = new Date(dateString);
    formattedDate = new Date(formattedDate.getTime() + formattedDate.getTimezoneOffset() * 60000)
    const year = formattedDate.getFullYear()
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
    const day   = formattedDate.getDate().toString().padStart(2, "0");
    return `${month}/${day}/${year}`
}

export const formatMileage = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatCost = (value: string) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency', 
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    if (value) {
        return parseFloat(value).toLocaleString("en-US", options)
    }
}