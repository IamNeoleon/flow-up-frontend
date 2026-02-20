import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
   minimum: 0.1,
   speed: 400,
   trickleSpeed: 200,
});

export const useNProgress = (isLoading: boolean) => {
   useEffect(() => {
      if (isLoading) {
         NProgress.start();
      } else {
         NProgress.done();
      }
      return () => { NProgress.done() };
   }, [isLoading]);
};