import React, { useEffect, useState } from 'react';
import {
	PaginatedTableProps,
	SimpleTableProps,
} from 'interfaces/components/tables';
import SimpleTable from './simpleTable';
import PaginationBar from '../paginationBar/paginationBar';
import { CypressI } from 'interfaces/cypress';

/**
 * This component is meant to render a paginated table with a simple design
 * it has many style props so it can be overwritten easily.
 *
 * This table has the capability to be extended, but on its own should be able to handle calls to an API
 * so it renders properly the data based on Current page to display and a PageSize given
 *
 * NOTE: Call to backend to fetch paginated data is simple, this should be modified since many API's can return
 * many responses, this component expects a simple PaginatedResponse<T[]> but that interface as well as
 * call handling should be modified depending on the situation
 *
 * @param props Props extends simpleTableProps so it can handle current page and a page size
 * 				This time rows can be an Array or a function that will fetch the data from a backend API
 * @returns a JSX element that represents the table
 */
const PaginatedTable = <T,>(
	props: PaginatedTableProps<T> & CypressI & Omit<SimpleTableProps<T>, 'rows'>
): JSX.Element => {
	const [currentPage, setCurrentPage] = useState<number>(props.page);

	// Set rows data in case there is a fetching function
	const [rowsData, setRowsData] = useState<T[]>([]);

	// In case rowsData is a function the it needs to fetch the data from endpoint
	const handleSetRows = async (): Promise<void> => {
		if (Array.isArray(props.rows)) {
			setRowsData(props.rows);
		} else {
			// This call wont necessarily be this easy, might need to change this depending on the
			// backend project
			const responseRows = await props.rows(currentPage, props.pageSize);
			setRowsData(responseRows);
		}
	};
	useEffect(() => {
		handleSetRows();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.rows, currentPage, props.pageSize]);

	return (
		<div className="flex flex-col gap-4 w-auto relative overflow-auto rounded-lg">
			{/* Table Container */}
			<SimpleTable {...props} rows={rowsData} />

			{/* Paginated information */}
			<PaginationBar
				dataCY={`${props.dataCY}-paginationBar`}
				currentPage={currentPage}
				totalPages={
					props.totalPages ??
					Math.max(1, Math.ceil(rowsData.length / props.pageSize))
				}
				onPageChange={(pageNumber: number) => {
					setCurrentPage(pageNumber);
				}}
				classNameContainer="self-center"
			/>
		</div>
	);
};

export default PaginatedTable;
