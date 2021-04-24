import { User } from "./types";

// export const filterUsers = (users: User[], filters: Record<string, string[]>) =>
//   users.filter(user =>
//     Object.entries(filters).every(([filterKey, filterValues]) =>
//       filterValues.some(filterValue =>
//         filterKey === 'isAdmin'
//           ? user.isAdmin === getNormalizedBooleanValue(filterValue)
//           : user[filterKey as keyof User] === filterValue,
//       ),
//     ),
//   );

export const getFilterValues = (users: User[]) => {
	const logins: string[] = [];
	const emails: string[] = [];

	users.forEach(({ login, email }) => {
		logins.push(login);
		emails.push(email);
	});

	return {
		logins,
		emails,
	};
};

export const getBackgroundColor = (index: number) => (index % 2 ? "#00000010" : "#fff");
