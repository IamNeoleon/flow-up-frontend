import { useGetMeQuery } from "@/features/user/api/userApi"
import { useAppDispatch } from "@/shared/hooks/redux"
import { setUser } from "@/store/slices/userSlice"
import { useEffect } from "react"

export const useAuth = () => {
	const dispatch = useAppDispatch();

	const { data, isLoading, isError, isSuccess } = useGetMeQuery();

	useEffect(() => {
		if (data && !isError) {
			dispatch(setUser(data))
		}
	}, [data, isError, dispatch]);

	return {
		isAuthenticated: isSuccess,
		isLoading,
	};
};

