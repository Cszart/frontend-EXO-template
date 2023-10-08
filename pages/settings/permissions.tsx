import withAuthorization from 'components/auth/withAuthorization';
import { Table } from 'components/common';
import { Typography } from 'components/form';
import { Layout } from 'components/layout';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { users } from 'data/tables/tableUser';
import * as React from 'react';
import { rolesPermissions } from 'utils';

const PermissionsScreen = (): JSX.Element => {
	return (
		<Layout withSidebar>
			<div>
				<Typography type="headline-3" className="mb-10">
					Permissions
				</Typography>
				<Table columns={Object.keys(users[0])} rows={users} />
			</div>
		</Layout>
	);
};

export default withAuthorization(
	PermissionsScreen,
	rolesPermissions(),
	[RolesEnum.ADMIN],
	AppRoutes.HOME
);