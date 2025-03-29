import useSWR from "swr";
import { supabase } from "../supabaseClient";

const fetchUser = async () => {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data?.session?.user || null;
};

const useCurrentUser = () => {
	const {
		data: user,
		error,
		isValidating,
	} = useSWR("userSession", fetchUser, { revalidateOnFocus: false });

	return { user, loading: isValidating, error };
};

export default useCurrentUser;
