import { useEffect } from "react";
import { useDispatch } from "react-redux";
import appActions from "../../store/app/actions";

const Logout = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(appActions.logout());
	}, [dispatch]);

	return null;
};

export default Logout;
