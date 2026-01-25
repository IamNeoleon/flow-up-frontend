export const formatDate = (
   date: Date | string,
   locale: string = 'ru-RU'
) => {
   const d = typeof date === 'string' ? new Date(date) : date

   return d.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   })
}