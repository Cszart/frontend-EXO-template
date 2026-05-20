import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Layout } from 'components/layout';
import { RoleI } from 'interfaces';
import SimpleTable from 'components/common/tables/simpleTable';
import { rolesService } from 'api_services';
import useModal from 'hooks/useModal';
import { InputText } from 'components/form';
import { useForm } from 'react-hook-form';
import { Button } from 'components/common';
import { DeleteModalContent } from 'components/modals';
import RolesEnum from 'const/role';
import PermissionsEnum from 'const/permissions';
import { useSession } from 'next-auth/react';

const RolesScreen = (): JSX.Element => {
	//Utils
	const session = useSession();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors, isDirty, isValid },
	} = useForm({
		mode: 'onChange',
	});

	// - Modals
	const { Modal: ModalRole, show: showRole, hide: hideRole } = useModal();
	const {
		Modal: ModalDeleteRole,
		show: showDeleteRole,
		hide: hideDeleteRole,
	} = useModal();

	// - Data
	const [rolesData, setRolesData] = useState<RoleI[]>();
	const [idSelectedRole, setIdSelectedRole] = useState<number | undefined>();

	// - Rules
	const rules = {
		role: {
			required: { value: true, message: 'This is requeried' },
		},
	};

	// - Functions
	async function fetchRoles(): Promise<void> {
		const rolesResponse = await rolesService.getAll();

		if (rolesResponse.status == 200) {
			setRolesData(rolesResponse.data);
		} else {
			setRolesData([]);
		}
	}

	// Create role handler - TODO: implement own logic
	const handleSubmitData = async (formData: any): Promise<void> => {
		setIsLoading(true);
		const { role } = formData;

		if (idSelectedRole) {
			const updateResponse = await rolesService.update(idSelectedRole, {
				role,
			});

			toast.success(updateResponse.message);
		} else {
			const createResponse = await rolesService.create({
				uuid: role,
				role: role,
			});

			toast.success(createResponse.message);
		}

		fetchRoles();
		setIsLoading(false);
		hideRole();
		reset();
		setIdSelectedRole(undefined);
	};

	// Delete role handler - TODO: implement own logic
	const handleDeleteRole = async (): Promise<void> => {
		if (idSelectedRole) {
			setIsLoading(true);
			const deleteResponse = await rolesService.delete(idSelectedRole);

			toast.success(deleteResponse.message);
			fetchRoles();
			setIsLoading(false);
			hideDeleteRole();
			setIdSelectedRole(undefined);
		}
	};

	// Function to handle editing a role
	const handleEditRole = (role: RoleI): void => {
		// Set the initial values for the form fields
		setValue('role', role.role);
		setIdSelectedRole(role.id);

		// Show the modal for editing the role
		showRole();
	};

	// Fetch roles
	useEffect(() => {
		fetchRoles();
	}, []);

	return (
		<Layout
			withHeader
			withSidebar
			title="Roles Management"
			buttonTitle="Create a Role"
			onClickButton={showRole}
			allowedPermissions={['role:management:create']}
			allowedRoles={[RolesEnum.ADMIN]}
		>
			<SimpleTable<RoleI>
				columns={[
					{
						header: 'UUID',
						content: (instance) => <p>{instance.uuid}</p>,
					},
					{
						header: 'Role',
						content: (instance) => <p>{instance.role}</p>,
					},
					{
						header: 'Created at',
						content: (instance) => <p>{instance.createdAt}</p>,
					},
					{
						header: 'Modified at',
						content: (instance) => <p>{instance.modifiedAt}</p>,
					},
				]}
				rows={rolesData}
				hideRowActions={session?.data?.user?.roles?.some(
					(role) => role === RolesEnum.MODERATOR
				)}
				rowActions={(instance: RoleI) => [
					{
						label: 'Edit',
						name: 'edit',
						onClick: () => {
							handleEditRole(instance);
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.ROLE_MANAGEMENT_EDIT],
					},
					{
						label: 'Delete',
						name: 'delete',
						onClick: () => {
							setIdSelectedRole(instance.id);
							showDeleteRole();
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.ROLE_MANAGEMENT_DELETE],
					},
				]}
			/>
			{/* Create and update role */}
			<ModalRole title={`${idSelectedRole ? 'Edit' : 'Create a'} Role`}>
				<form className="mt-4" onSubmit={handleSubmit(handleSubmitData)}>
					<InputText
						register={register}
						name="role"
						title="Role"
						customPlaceholder="Role"
						rules={rules.role}
						error={errors.role}
					/>
					<div className="flex gap-x-4 w-full justify-center mt-8">
						<Button
							label="Cancel"
							decoration="line-primary"
							size="extra-small"
							type="button"
							disabled={isLoading}
							onClick={() => {
								hideRole();
								reset();
								setIdSelectedRole(undefined);
							}}
						/>
						<Button
							type="submit"
							label="Save"
							decoration="fill"
							size="extra-small"
							loading={isLoading}
							disabled={!isDirty || !isValid}
						/>
					</div>
				</form>
			</ModalRole>

			<ModalDeleteRole title="Delete Role">
				<DeleteModalContent
					type="role"
					isLoading={isLoading}
					onClickCancel={() => {
						hideDeleteRole();
						setIdSelectedRole(undefined);
					}}
					onClickSave={handleDeleteRole}
				/>
			</ModalDeleteRole>
		</Layout>
	);
};

export default RolesScreen;
