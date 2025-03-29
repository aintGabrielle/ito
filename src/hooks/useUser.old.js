import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const useUser = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSession = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error("Error fetching session:", error.message);
				setUser(null);
			} else {
				setUser(data?.session?.user || null);
			}

			setLoading(false);
		};

		fetchSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user || null);
			},
		);

		return () => listener?.subscription?.unsubscribe();
	}, []);

	return { user, loading };
};

export default useUser;
