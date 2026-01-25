import { useTitle } from "@/shared/hooks/use-title";

const HomePage = () => {
   useTitle("Home")

   return (
      <>
         <h1>home page</h1>
      </>
   );
};

export default HomePage;
