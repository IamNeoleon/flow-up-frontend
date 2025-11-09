import { useForm, type SubmitHandler } from "react-hook-form";

interface IFormRegister {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}

export const RegisterBlock = () => {
   const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormRegister>({
      mode: "onChange"
   });

   const password = watch("password");

   const onSubmit: SubmitHandler<IFormRegister> = data => {
      console.log("Данные формы:", data);
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="p-10 border-2 rounded-2xl flex flex-col gap-4 w-[320px] mx-auto"
      >
         <h1 className="text-3xl text-center font-bold">Регистрация</h1>

         <div>
            {errors.name && <p className="text-red-500 text-xs mb-1">{errors.name.message}</p>}
            <input
               type="text"
               placeholder="Имя"
               {...register("name", { required: "Имя обязательно" })}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>

         <div>
            {errors.email && <p className="text-red-500 text-xs mb-1">{errors.email.message}</p>}
            <input
               type="email"
               placeholder="Email"
               {...register("email", {
                  required: "Email обязателен",
                  pattern: {
                     value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                     message: "Некорректный email"
                  }
               })}
               className="w-full px-3 py-2 border rounded-md focus:border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>

         <div>
            {errors.password && <p className="text-red-500 text-xs mb-1">{errors.password.message}</p>}
            <input
               type="password"
               placeholder="Пароль"
               {...register("password", { required: "Пароль обязателен", minLength: { value: 6, message: "Минимум 6 символов" } })}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>

         <div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mb-1">{errors.confirmPassword.message}</p>}
            <input
               type="password"
               placeholder="Повторите пароль"
               {...register("confirmPassword", {
                  required: "Подтвердите пароль",
                  validate: value => value === password || "Пароли не совпадают"
               })}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>

         <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
         >
            Зарегистрироваться
         </button>
      </form>
   );
};
