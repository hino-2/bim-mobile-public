import { isNil } from "ramda";
import { Attribute } from "../attributes/types";
import { findAttributeByID } from "../attributes/utils";
import { ResponseRuleAttribute, RuleAttribute } from "./types";

export const mapRuleAttributes = (
	ruleAttributes: ResponseRuleAttribute[],
	attributes: Attribute[]
) =>
	ruleAttributes.map<RuleAttribute>((ruleAttribute) => {
		const { attributeID, conditionalAttributeID } = ruleAttribute;

		const attribute = attributes.find(findAttributeByID(attributeID));

		const conditionalAttribute = attributes.find(findAttributeByID(conditionalAttributeID));

		return {
			...ruleAttribute,
			name: attribute ? attribute.name || attributeID : attributeID,
			displayName: attribute ? attribute.name || attributeID : "Атрибут удалён",
			attribute,
			conditionalAttribute,
			removedAttribute: !attribute,
			removedConditionalAttribute: conditionalAttributeID
				? isNil(conditionalAttribute)
				: undefined,
		};
	});
