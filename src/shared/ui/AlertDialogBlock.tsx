import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/shared/ui/shadcn/alert-dialog"

interface IAlertDialogBlockProps {
   children: React.ReactNode,
   title: string,
   description?: string,
   cancelLabel: string,
   actionLabel: string,
   onClickAction: () => void;
}

export const AlertDialogBlock = ({ children, title, description, cancelLabel, actionLabel, onClickAction }: IAlertDialogBlockProps) => {
   return (
      <>
         <AlertDialog>
            <AlertDialogTrigger asChild>
               {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{title}</AlertDialogTitle>
                  <AlertDialogDescription>
                     {description}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                  <AlertDialogAction onClick={onClickAction}>{actionLabel}</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};
