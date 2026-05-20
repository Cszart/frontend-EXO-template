import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Layout } from 'components/layout';
import { PermissionI } from 'interfaces';
import { permissionService } from 'api_services';
import SimpleTable from 'components/common/tables/simpleTable';
import useModal from 'hooks/useModal';
import { useForm } from 'react-hook-form';
import { InputText } from 'components/form';
import { Button } from 'components/common';
import { DeleteModalContent } from 'components/modals';
import RolesEnum from 'const/role';
import PermissionsEnum from 'const/permissions';
import { useSession } from 'next-auth/react';

const PermissionsScreen = (): JSX.Element => {
	// - Utils
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
	const {
		Modal: ModalCreatePermission,
		show: showCreatePermission,
		hide: hideCreatePermission,
	} = useModal();
	const {
		Modal: ModalDeletePermission,
		show: showDeletePermission,
		hide: hideDeletePermission,
	} = useModal();

	// - Data
	const [permissionsData, setPermissionsData] = useState<PermissionI[]>();
	const [idSelectedPermission, setIdSelectedPermission] = useState<
		number | undefined
	>();

	// - Rules
	const rules = {
		category: {
			required: { value: true, message: 'This is requeried' },
		},
	};

	// - Functions
	async function fetchPermissions(): Promise<void> {
		const permissionsResponse = await permissionService.getAll();

		if (permissionsResponse.status == 200) {
			setPermissionsData(permissionsResponse.data);
		} else {
			setPermissionsData([]);
		}
	}

	// Create permission handler - TODO: implement own logic
	const handleSubmitData = async (formData: any): Promise<void> => {
		setIsLoading(true);
		const { category, subCategory, permission } = formData;
		const permissionUUID = `${category}:${subCategory}:${permission}`; // Should be handled by backend really, but since its a demostration

		const payload: Partial<PermissionI> = {
			uuid: permissionUUID,
			category,
			subCategory,
			permission,
		};

		if (idSelectedPermission) {
			const updateResponse = await permissionService.update(
				idSelectedPermission,
				payload
			);
			toast.success(updateResponse.message);
		} else {
			const createResponse = await permissionService.create(payload);
			toast.success(createResponse.message);
		}

		fetchPermissions();

		setIsLoading(false);
		hideCreatePermission();
		reset();
		setIdSelectedPermission(undefined);
	};

	// Delete user handler - TODO: implement own logic
	const handleDeletePermission = async (): Promise<void> => {
		if (idSelectedPermission) {
			setIsLoading(true);
			const deleteResponse =
				await permissionService.delete(idSelectedPermission);

			toast.success(deleteResponse.message);
			fetchPermissions();
			setIsLoading(false);
			hideDeletePermission();
			setIdSelectedPermission(undefined);
		}
	};

	// Function to handle editing a permission
	const handleEditPermission = (permission: PermissionI): void => {
		// Set the initial values for the form fields
		setValue('category', permission.category);
		setValue('subCategory', permission.subCategory);
		setValue('permission', permission.permission);
		setIdSelectedPermission(permission.id);

		// Show the modal for editing the permission
		showCreatePermission();
	};

	// - UseEffects
	// Fetch permissions data and set State
	useEffect(() => {
		fetchPermissions();
	}, []);

	return (
		<Layout
			withHeader
			withSidebar
			title="Permissions Management"
			buttonTitle="Create a Permission"
			onClickButton={showCreatePermission}
			allowedPermissions={['permission:management:create']}
			allowedRoles={[RolesEnum.ADMIN]}
		>
			<SimpleTable<PermissionI>
				columns={[
					{
						header: 'UUID',
						content: (instance) => <p>{instance.uuid}</p>,
					},
					{
						header: 'Category',
						content: (instance) => <p>{instance.category}</p>,
					},
					{
						header: 'Sub Category',
						content: (instance) => <p>{instance.subCategory}</p>,
					},
					{
						header: 'Permission',
						content: (instance) => <p>{instance.permission}</p>,
					},
				]}
				rows={permissionsData}
				hideRowActions={session?.data?.user?.roles?.some(
					(role) => role === RolesEnum.MODERATOR
				)}
				rowActions={(instance: PermissionI) => [
					{
						label: 'Edit',
						name: 'edit',
						onClick: () => {
							handleEditPermission(instance);
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.PERMISSION_MANAGEMENT_EDIT],
					},
					{
						label: 'Delete',
						name: 'delete',
						onClick: () => {
							setIdSelectedPermission(instance.id);
							showDeletePermission();
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.PERMISSION_MANAGEMENT_DELETE],
					},
				]}
			/>

			<ModalCreatePermission
				title={`${idSelectedPermission ? 'Edit' : ' Create a'} Permission`}
			>
				<form
					className="mt-4 space-y-4"
					onSubmit={handleSubmit(handleSubmitData)}
				>
					<InputText
						register={register}
						name="category"
						title="Category"
						customPlaceholder="Principal area where the permission belongs (EX: users) "
						rules={rules.category}
						error={errors.category}
					/>
					<InputText
						register={register}
						name="subCategory"
						title="Sub Category"
						customPlaceholder="Write a sub category (EX: management, post, comments)"
					/>
					<InputText
						register={register}
						name="permission"
						title="Permission"
						customPlaceholder="Write permission name or action"
					/>
					<div className="flex gap-x-4 w-full justify-center mt-8">
						<Button
							label="Cancel"
							decoration="line-primary"
							size="extra-small"
							type="button"
							disabled={isLoading}
							onClick={() => {
								hideCreatePermission();
								reset();
								setIdSelectedPermission(undefined);
							}}
						/>
						<Button
							type="submit"
							label="Save"
							decoration="fill"
							size="extra-small"
							disabled={!isDirty || !isValid}
							loading={isLoading}
						/>
					</div>
				</form>
			</ModalCreatePermission>

			<ModalDeletePermission title="Delete Permission">
				<DeleteModalContent
					type="permission"
					isLoading={isLoading}
					onClickCancel={() => {
						hideDeletePermission();
						setIdSelectedPermission(undefined);
					}}
					onClickSave={handleDeletePermission}
				/>
			</ModalDeletePermission>
		</Layout>
	);
};

export default PermissionsScreen;
