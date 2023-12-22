const calcTotalPages = (total: number, limit: number) => {
    let totalPages = 0;
    totalPages = Math.ceil(total / limit);
    return totalPages;
}

export default calcTotalPages;