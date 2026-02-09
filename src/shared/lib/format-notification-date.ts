import i18n from "@/config/i18n/i18n"
import dayjs from './day-js'

export const formatNotificationDate = (iso: string) => {
   const d = dayjs(iso)

   if (d.isToday()) {
      return `${i18n.t("date.today")}, ${d.format("HH:mm")}`
   }

   if (d.isYesterday()) {
      return `${i18n.t("date.yesterday")}, ${d.format("HH:mm")}`
   }

   return d.format("DD.MM.YYYY HH:mm")
}
