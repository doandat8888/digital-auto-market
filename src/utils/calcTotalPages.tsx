const calcTotalPages = (total: number, limit: number) => {
    let totalPages = 0;
    if(total % limit === 0) {
        totalPages = Math.floor(total / limit);
    }else {
        totalPages = Math.floor(total / limit) + 1;
    }
    return totalPages;
}

export default calcTotalPages;