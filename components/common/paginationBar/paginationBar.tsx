import clsx from 'clsx';
import { CypressI } from 'interfaces/cypress';
import React from 'react';

interface PaginationBarProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;

	showFirstButton?: boolean;
	showLastButton?: boolean;

	classNameContainer?: string;
	classNameActivePage?: string;
	classNamePage?: string;
	classNameButtons?: string;
}

const PaginationBar: React.FC<PaginationBarProps & CypressI> = ({
	dataCY,

	totalPages,
	currentPage,
	onPageChange,

	showFirstButton = true,
	showLastButton = true,

	classNameContainer = 'w-fit',
	classNameActivePage = 'text-white font-bold bg-blue hover:bg-blue/80',
	classNamePage = 'text-dark-80 font-medium bg-dark-10 hover:bg-dark-30 hover:text-dark-100',
	classNameButtons = 'text-dark-80 font-medium bg-dark-10 hover:bg-dark-30 hover:text-dark-100',
}) => {
	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, index) => index + 1
	);

	const firstPage = 1;
	const lastPage = totalPages;

	const renderPageNumbers = (): JSX.Element[] => {
		if (totalPages <= 10) {
			return pageNumbers.map((pageNumber) => (
				<button
					key={pageNumber}
					className={clsx(
						'flex items-center justify-center p-2',
						'leading-tight',
						{
							[classNameActivePage]: pageNumber === currentPage,
							[classNamePage]: pageNumber !== currentPage,
						}
					)}
					onClick={() => onPageChange(pageNumber)}
				>
					{pageNumber}
				</button>
			));
		} else {
			const visiblePages = [
				currentPage - 2,
				currentPage - 1,
				currentPage,
				currentPage + 1,
				currentPage + 2,
			].filter(
				(pageNumber) => pageNumber >= firstPage && pageNumber <= lastPage
			);

			return visiblePages.map((pageNumber, index) => (
				<button
					key={index}
					className={clsx(
						'flex items-center justify-center p-2',
						'leading-tight',
						{
							[classNameActivePage]: pageNumber === currentPage,
							[classNamePage]: pageNumber !== currentPage,
						}
					)}
					onClick={() => onPageChange(pageNumber)}
				>
					{pageNumber}
				</button>
			));
		}
	};

	return (
		<nav
			data-cy={dataCY}
			className={clsx(
				'flex items-center justify-center divide-x divide-gray-300',
				classNameContainer
			)}
		>
			{/* Buttons */}
			{showFirstButton && (
				<button
					data-cy={`${dataCY}-first`}
					className={clsx(
						'flex items-center justify-center p-2',
						'leading-tight border-l rounded-l-lg',
						classNameButtons
					)}
					disabled={currentPage === firstPage}
					onClick={() => onPageChange(firstPage)}
				>
					First
				</button>
			)}

			<button
				data-cy={`${dataCY}-prev`}
				className={clsx(
					'flex items-center justify-center p-2',
					'leading-tight',
					classNameButtons
				)}
				disabled={currentPage === firstPage}
				onClick={() => onPageChange(currentPage - 1)}
			>
				Prev
			</button>

			{/* Pages */}
			{renderPageNumbers()}

			{/* Buttons */}
			<button
				data-cy={`${dataCY}-next`}
				className={clsx(
					'flex items-center justify-center p-2',
					'leading-tight',
					classNameButtons
				)}
				disabled={currentPage === lastPage}
				onClick={() => onPageChange(currentPage + 1)}
			>
				Next
			</button>
			{showLastButton && (
				<button
					data-cy={`${dataCY}-last`}
					className={clsx(
						'flex items-center justify-center p-2',
						'leading-tight !border-r rounded-r-lg',
						classNameButtons
					)}
					disabled={currentPage === lastPage}
					onClick={() => onPageChange(lastPage)}
				>
					Last
				</button>
			)}
		</nav>
	);
};

export default PaginationBar;
