import { useTitle } from "@/hooks/useTitle";

const HomePage = () => {
   useTitle("Home")

   return (
      <>
         <h1>home page</h1>
      </>
   );
};

export default HomePage;
