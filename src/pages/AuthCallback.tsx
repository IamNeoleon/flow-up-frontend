import { useRefreshMutation } from "@/services/auth/api/authApi";
import { useAppDispatch } from "@/shared/hooks/redux";
import { setToken } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AuthCallback = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const [refresh, { data, isSuccess }] = useRefreshMutation();

   useEffect(() => {
      refresh();
   }, [refresh]);

   useEffect(() => {
      if (!isSuccess || !data) return;

      dispatch(setToken(data.accessToken));

      navigate('/', { replace: true });
   }, [isSuccess, data, dispatch, navigate]);

   return null;
};

export default AuthCallback;
