import { createEntityAdapter } from "@reduxjs/toolkit";
import { Attribute } from "./types";

const attributesAdapter = createEntityAdapter<Attribute>({
	selectId: (attribute) => attribute._id,
});

export { attributesAdapter };
