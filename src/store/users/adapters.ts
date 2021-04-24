import { createEntityAdapter } from "@reduxjs/toolkit";
import { User } from "./types";

const usersAdapter = createEntityAdapter<User>({
	selectId: (user) => user.email,
	sortComparer: (a, b) => a.email.localeCompare(b.email),
});

export { usersAdapter };
