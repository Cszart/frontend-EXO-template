/**
 * General props for tables
 */

import PermissionsEnum from 'const/permissions';
import { Option } from './option';
import RolesEnum from 'const/role';

// Props that represent a column
export interface ColumnProps<T> {
	header: string;
	content: (instance: T) => JSX.Element | null;
	leftIcon?: JSX.Element;
	rightIcon?: JSX.Element;
}

// Props that represent a row
export interface RowOptions<T> extends Option {
	onClick: (instance: T) => void;
	permissions?: PermissionsEnum[];
	roles?: RolesEnum[];
}

// General table props
export interface SimpleTableProps<T> {
	/**
	 * Data for each of the columns of the table
	 */
	columns: ColumnProps<T>[];

	/**
	 * The data to show on the rows
	 * Or a function that will handle fetching the content
	 */
	rows?: T[];

	/**
	 * Actions specified here will be added to the Actions menu
	 */
	rowActions?: (instance: T) => RowOptions<T>[];

	/**
	 * If `true`, the actions section in each column will be not rendered
	 */
	hideRowActions?: boolean;

	/**
	 * Element to be render instead of actions dropdown menu.
	 */
	rowActionsCustom?: JSX.Element;

	/**
	 * If table is in loading state
	 */
	isLoading?: boolean;

	/**
	 * Show custom element when table is in loading state
	 */
	isLoadingElement?: JSX.Element;

	/**
	 * Component to render if table data is empty.
	 * Default value is "No data to display"
	 */
	tableEmptyComponent?: JSX.Element;

	/**
	 * Make header of the table sticky
	 */
	stickyHeader?: boolean;

	// --- Style props --- //
	/**
	 * Style for table headers (Tailwind string)
	 */
	stylesForHeader?: string;

	/**
	 * Style for row actions (Tailwind string)
	 */
	stylesForRows?: string;
}

// Props for paginated table (extends simple table props)
export interface PaginatedTableProps<T> {
	/**
	 * The data to show on the rows
	 * Or a function that will handle fetching the content
	 */
	rows: T[] | ((page: number, rowsPerPage: number) => Promise<T[]>);

	/**
	 * Number of page to show
	 */
	page: number;

	/**
	 * Number of rows to show in a page
	 */
	pageSize: number;

	/**
	 * Total number of pages.
	 * Required when `rows` is a fetch function.
	 * When `rows` is an array, it is computed automatically if omitted.
	 */
	totalPages?: number;
}
