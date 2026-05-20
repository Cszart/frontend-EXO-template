/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Layout } from 'components/layout';
import { Option, UserI } from 'interfaces';
import SimpleTable from 'components/common/tables/simpleTable';
import { rolesService, userService } from 'api_services';
import useModal from 'hooks/useModal';
import { useForm } from 'react-hook-form';
import { InputList, InputText } from 'components/form';
import { Button } from 'components/common';
import { allPermissions, onlyViewPermissions } from 'utils';
import { DeleteModalContent } from 'components/modals';
import RolesEnum from 'const/role';
import PermissionsEnum from 'const/permissions';
import { brand } from 'const';

const UsersScreen = (): JSX.Element => {
	// Utils
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { register, reset, handleSubmit, setValue } = useForm({
		mode: 'onChange',
	});

	// - Modal
	const {
		Modal: ModalCreateUser,
		show: showCreateUser,
		hide: hideCreateUser,
	} = useModal();
	const {
		Modal: ModalDeleteUser,
		show: showDeleteUser,
		hide: hideDeleteUser,
	} = useModal();

	// - Data
	const [usersData, setUsersData] = useState<UserI[]>();
	const [rolesData, setRolesData] = useState<Option[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserI | undefined>();

	// - Functions
	async function fetchUsers(): Promise<void> {
		const usersResponse = await userService.getAll();

		if (usersResponse.status == 200) {
			setUsersData(usersResponse.data);
		} else {
			setUsersData([]);
		}
	}

	async function fetchRoles(): Promise<void> {
		const rolesRespose = await rolesService.getAll();

		if (rolesRespose.status == 200) {
			const optionsAux: Option[] = [
				{
					name: '',
					label: 'Select a role',
					placeholder: true,
				},
			];

			rolesRespose.data.map((role) => {
				optionsAux.push({
					label: role.role,
					name: role.role,
				});
			});
			setRolesData(optionsAux);
		} else {
			setRolesData([]);
		}
	}

	// Create user handler - TODO: implement own logic
	const handleSubmitData = async (formData: any): Promise<void> => {
		setIsLoading(true);

		let permissionsData: PermissionsEnum[] = [];
		if (formData.role == RolesEnum.ADMIN) permissionsData = allPermissions();
		if (formData.role == RolesEnum.MODERATOR)
			permissionsData = onlyViewPermissions();

		const payload: Partial<UserI> = {
			name: formData.name,
			email: formData.email,
			username: formData.username,
			image: formData && formData.image ? formData.image : brand.defaultAvatar,
			roles: [formData.role],
			permissions: permissionsData,
		};

		if (selectedUser) {
			const updateResponse = await userService.update(selectedUser.id, payload);
			toast.success(updateResponse.message);
		} else {
			const createResponse = await userService.create({
				...payload,
			});
			toast.success(createResponse.message);
		}

		fetchUsers();

		setIsLoading(false);
		hideCreateUser();
		setSelectedUser(undefined);
	};

	// Delete user handler - TODO: implement own logic
	const handleDeleteUser = async (): Promise<void> => {
		if (selectedUser) {
			setIsLoading(true);
			const deleteResponse = await userService.delete(selectedUser.id);

			toast.success(deleteResponse.message);
			fetchUsers();
			setIsLoading(false);
			hideDeleteUser();
			setSelectedUser(undefined);
		}
	};

	// Function to handle editing a user
	const handleselectedUser = (user: UserI): void => {
		// Set the initial values for the form fields
		setValue('name', user.name);
		setValue('email', user.email);
		setValue('username', user.username);
		setValue('image', user.image);
		setSelectedUser(user);

		// Show the modal for editing the user
		showCreateUser();
	};

	// - UseEffects
	// Fetch users and roles
	useEffect(() => {
		fetchUsers();
		fetchRoles();
	}, []);

	return (
		<Layout
			withHeader
			withSidebar
			title="Users Management"
			buttonTitle="Create a User"
			onClickButton={showCreateUser}
			allowedPermissions={['user:management:create']}
			allowedRoles={[RolesEnum.ADMIN]}
		>
			<SimpleTable<UserI>
				columns={[
					{
						header: 'Image',
						content: (instance) => (
							<img src={instance.image} className="w-10 h-10 rounded-full" />
						),
					},
					{
						header: 'Name',
						content: (instance) => <p>{instance.name}</p>,
					},
					{
						header: 'Username',
						content: (instance) => <p>{instance.username}</p>,
					},
					{
						header: 'Email',
						content: (instance) => <p>{instance.email}</p>,
					},
					{
						header: 'Roles',
						content: (instance) => (
							<ul>
								{instance.roles.map((item) => {
									return (
										<li key={`roles-user-${instance.id}-${item}`}>{item}</li>
									);
								})}
							</ul>
						),
					},
					{
						header: 'Permissions',
						content: (instance) => (
							<ul>
								{instance.permissions.map((item) => {
									return (
										<li key={`users-user-${instance.id}-${item}`}>{item}</li>
									);
								})}
							</ul>
						),
					},
				]}
				rows={usersData}
				rowActions={(instance: UserI) => [
					{
						label: 'Edit',
						name: 'edit',
						onClick: () => {
							handleselectedUser(instance);
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.USER_MANAGEMENT_EDIT],
					},
					{
						label: 'Delete',
						name: 'delete',
						onClick: () => {
							setSelectedUser(instance);
							showDeleteUser();
						},
						roles: [RolesEnum.ADMIN],
						permissions: [PermissionsEnum.USER_MANAGEMENT_DELETE],
					},
				]}
			/>

			<ModalCreateUser title={`${selectedUser ? 'Edit' : 'Create a'} User`}>
				<form
					className="mt-4 space-y-4"
					onSubmit={handleSubmit(handleSubmitData)}
				>
					<InputText
						register={register}
						name="image"
						title="Image URL (optional)"
						customPlaceholder="Please input an Image URL"
					/>
					<InputText
						register={register}
						name="name"
						title="Name"
						customPlaceholder="Name"
					/>
					<InputText
						register={register}
						name="email"
						title="Email"
						customPlaceholder="Email"
					/>
					<InputText
						register={register}
						name="username"
						title="Username"
						customPlaceholder="Username"
					/>
					<InputList
						register={register}
						name="role"
						title="Role"
						options={rolesData}
						myDefaultValue={selectedUser?.roles[0]}
						setValueInput={setValue}
					/>

					<div className="flex gap-x-4 w-full justify-center mt-8">
						<Button
							label="Cancel"
							decoration="line-primary"
							size="extra-small"
							type="button"
							disabled={isLoading}
							onClick={() => {
								hideCreateUser();
								reset();
								setSelectedUser(undefined);
							}}
						/>
						<Button
							label="Save"
							type="submit"
							decoration="fill"
							size="extra-small"
							loading={isLoading}
						/>
					</div>
				</form>
			</ModalCreateUser>

			<ModalDeleteUser title="Delete User">
				<DeleteModalContent
					type="user"
					isLoading={isLoading}
					onClickCancel={() => {
						hideDeleteUser();
						setSelectedUser(undefined);
					}}
					onClickSave={handleDeleteUser}
				/>
			</ModalDeleteUser>
		</Layout>
	);
};

export default UsersScreen;
