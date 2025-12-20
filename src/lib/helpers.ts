export const getMonth = (date: Date) => date.toLocaleString('en-US', { month: 'long' })
export const getYear = (date: Date) => date.getUTCFullYear()
