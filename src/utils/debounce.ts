const debounce = (fn: (...args: any[]) => {}, time: number) => {
    let timer: number | undefined
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(()=>fn(...args), time)
    }
}

export default debounce
