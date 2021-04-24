import { AggregatorsState } from "./aggregators/types";
import { AppState } from "./app/types";
import { AttributesState } from "./attributes/types";
import { RuleAttributesState } from "./rule-attributes/types";
import { TasksState } from "./tasks/types";
import { UsersState } from "./users/types";

export enum LoadingState {
	Idle = "Idle",
	Loading = "Loading",
	Resolve = "Resolve",
	Reject = "Reject",
}

export enum OpenState {
	Open = "Open",
	Add = "Add",
	Edit = "Edit",
	Closed = "Closed",
}

interface ErrorState {
	message: string | null;
	status: number | null;
}

type ValueOf<T> = T[keyof T];
type ValueType = string | number | boolean | null | undefined;

type ThenArg<T extends (...args: never) => Promise<unknown>> = ReturnType<T> extends Promise<
	infer U
>
	? U
	: T;

type RenderTemplate = Record<LoadingState, JSX.Element>;

interface ApplicationState {
	app: AppState;
	// drawer: DrawerState;
	attributes: AttributesState;
	// conditions: ConditionsState;
	aggregators: AggregatorsState;
	// rules: RulesState;
	// exportRules: ExportRulesState;
	// hierarchyTemplates: HierarchyTemplatesState;
	ruleAttributes: RuleAttributesState;
	users: UsersState;
	// items: ItemsState;
	tasks: TasksState;
	// files: FilesState;
	// sizes: SizesState;
}

export type { ApplicationState, ErrorState, ThenArg, ValueType, ValueOf, RenderTemplate };
