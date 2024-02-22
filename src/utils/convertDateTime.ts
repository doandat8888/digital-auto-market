const convertDateTime = (dateStr: string) => {
    const originalDate = new Date(dateStr);

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Month start from 0
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();
    const seconds = originalDate.getSeconds();

    //Format string
    const formattedDateTime = padZero(day) + '/' + padZero(month) + '/' + year + ' ' +
        padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);

    return formattedDateTime;
}

const padZero = (number: number) => {
    return number < 10 ? '0' + number : number;
}

export default convertDateTime;


