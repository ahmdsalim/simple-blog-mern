const formatDate = (str_date) => {
    const date = new Date(str_date)

    const formattedDate = date.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

    return formattedDate
}

export default formatDate