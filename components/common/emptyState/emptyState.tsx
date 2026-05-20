import * as React from 'react';
import { Typography } from '../typography';
import Image from 'next/image';
import { CypressI } from 'interfaces/cypress';
import { brand } from 'const';

export const EmptyState: React.FC<CypressI> = ({ dataCY }): JSX.Element => {
	return (
		<div
			data-cy={dataCY}
			className="flex flex-col w-full mt-20 justify-center items-center md:m-5"
		>
			<Image
				src={brand.emptyStateImage}
				width={100}
				height={120}
				alt="empty state"
			/>
			<Typography type="headline-3" className="font-bold mt-4">
				No results found
			</Typography>
			<Typography type="body-1" className="mt-3">
				Sorry, there are not results for this page
			</Typography>
		</div>
	);
};
