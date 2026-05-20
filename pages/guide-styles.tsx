import {
	Typography,
	Separator,
	Button,
	Avatar,
	Spinner,
} from 'components/common';
import { Dropdown } from 'components/common/dropdown';
import { EmptyState } from 'components/common/emptyState';
import PaginatedTable from 'components/common/tables/paginatedTable';
import SimpleTable from 'components/common/tables/simpleTable';
import { InputText, InputEmail, InputList } from 'components/form';
import InputPassword from 'components/form/input-password/input-password';
import { Layout } from 'components/layout';
import { UserI } from 'interfaces';
import { useForm } from 'react-hook-form';
import { HomeIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { toast } from 'sonner';

const DummyUsersData = [
	{
		id: 1,
		email: 'john@example.com',
		username: 'john_doe',
		name: 'John Doe',
		image: 'path-to-image',
		roles: ['admin'],
		permissions: [
			'user:management:view',
			'user:management:create',
			'user:management:edit',
			'user:management:delete',
			'role:management:view',
			'role:management:create',
			'role:management:edit',
			'role:management:delete',
			'permission:management:view',
			'permission:management:create',
			'permission:management:edit',
			'permission:management:delete',
		],
		accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3Mi...Ix-E',
	},
	{
		id: 2,
		email: 'jane@example.com',
		username: 'jane_smith',
		name: 'Jane Smith',
		image: 'path-to-image',
		roles: ['moderator'],
		permissions: [
			'user:management:view',
			'user:management:edit',
			'role:management:view',
			'role:management:edit',
		],
		accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3Mi...Ix-E',
	},
	{
		id: 3,
		email: 'mike@example.com',
		username: 'mike_jones',
		name: 'Mike Jones',
		image: 'path-to-image',
		roles: ['user'],
		permissions: ['user:management:view'],
		accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3Mi...Ix-E',
	},
	{
		id: 4,
		email: 'sara@example.com',
		username: 'sara_adams',
		name: 'Sara Adams',
		image: 'path-to-image',
		roles: ['user'],
		permissions: ['user:management:view'],
		accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3Mi...Ix-E',
	},
];

const GuideStyles = (): JSX.Element => {
	const { register } = useForm({ mode: 'onChange' });
	return (
		<Layout
			withFooter
			withHeader
			withSidebar
			title="Guide Styles"
			classNameTitle="!text-3xl"
		>
			<div className="flex flex-col items-start justify-center gap-20 w-full">
				{/* *** Typography *** */}
				<Separator text="Typography" />
				<div className="flex flex-wrap space-x-10 w-full">
					<div className="space-y-10">
						<Typography type="headline-2">headline-2</Typography>
						<Typography type="headline-3">headline-3</Typography>
						<Typography type="headline-4">headline-4</Typography>
						<Typography type="headline-5">headline-5</Typography>
					</div>
					<div className="space-y-10">
						<Typography type="subtitle-1">subtitle-1</Typography>
						<Typography type="subtitle-2">subtitle-2</Typography>
						<Typography type="subtitle-3">subtitle-3</Typography>
					</div>
					<div className="space-y-10">
						<Typography type="link-1">link-1</Typography>
						<Typography type="link-2">link-2</Typography>
					</div>
					<div className="space-y-10">
						<Typography type="body-1">body-1</Typography>
						<Typography type="body-2">body-2</Typography>
					</div>
					<div className="space-y-10">
						<Typography type="caption-1">caption-1</Typography>
						<Typography type="caption-2">caption-2</Typography>
						<Typography type="caption-3">caption-3</Typography>
					</div>
					<Typography type="overline">overline</Typography>
				</div>
				{/* *** Buttons *** */}
				<Separator text="Buttons" />
				{/* Button decoration */}
				<div className="flex flex-wrap justify-between gap-4 w-full">
					<Button decoration="fill" size="medium">
						Button fill
					</Button>
					<Button decoration="line-primary" size="medium">
						Button line-primary
					</Button>
					<Button decoration="not-fill" size="medium">
						Button not-fill
					</Button>
				</div>
				{/* Button disabled */}
				<Separator text="Disabled" className="max-w-[200px] self-center" />
				<div className="flex flex-wrap justify-between gap-4 w-full">
					<Button decoration="fill" size="medium" disabled>
						Button fill disabled
					</Button>
					<Button decoration="line-primary" size="medium" disabled>
						Button line-primary disabled
					</Button>
					<Button decoration="not-fill" size="medium" disabled>
						Button not-fill disabled
					</Button>
				</div>
				{/* Button size */}
				<Separator text="Size" className="max-w-[200px] self-center" />
				<div className="flex flex-wrap justify-between gap-4 w-full">
					<Button decoration="fill" size="fit">
						Button fit
					</Button>
					<Button decoration="fill" size="extra-small">
						Button extra
					</Button>
					<Button decoration="fill" size="small">
						Button small
					</Button>
					<Button decoration="fill" size="medium">
						Button medium
					</Button>
					<Button decoration="fill" size="large">
						Button large
					</Button>
					<Button decoration="fill" size="full">
						Button full
					</Button>
				</div>
				{/* With icons */}
				<Separator text="With icons" className="max-w-[200px] self-center" />
				<div className="flex flex-wrap justify-between gap-4 w-full">
					<Button
						decoration="fill"
						size="fit"
						iconLeft
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconLeft"
					></Button>
					<Button
						decoration="fill"
						size="fit"
						iconRight
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconRight"
					></Button>
					<Button
						decoration="line-primary"
						size="fit"
						iconLeft
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconLeft"
					></Button>
					<Button
						decoration="line-primary"
						size="fit"
						iconRight
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconRight"
					></Button>
					<Button
						decoration="not-fill"
						size="fit"
						iconLeft
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconLeft"
					></Button>
					<Button
						decoration="not-fill"
						size="fit"
						iconRight
						icon={<HomeIcon className="w-6 h-6" />}
						label="Button iconRight"
					></Button>
				</div>
				{/* Button dropdown */}
				<Separator text="Dropdown" className="max-w-[200px] self-center" />
				<div className="flex flex-wrap justify-between gap-4 w-full">
					<Dropdown
						buttonContent="This is a dropdown button"
						showChevronDownIcon
						items={[
							{
								name: 'item1',
								label: 'Item 1',
								onClick: () => toast('This is item 1'),
							},
							{
								name: 'item2',
								label: 'Item 2',
								onClick: () => toast('This is item 2'),
							},
							{
								name: 'item3',
								label: 'Item 3',
								onClick: () => toast('This is item 3'),
							},
						]}
					/>
				</div>

				{/* Avatars */}
				<Separator text="Avatars" />
				<div className="flex flex-wrap justify-betwen gap-10 w-full">
					<Avatar photoUrl="/icons/svg/avatar.svg" className="w-20 h-20" />
					<Avatar photoUrl="/icons/svg/avatar.svg" size="large" />
					<Avatar photoUrl="/icons/svg/avatar.svg" size="medium" />
					<Avatar photoUrl="/icons/svg/avatar.svg" size="small" />
				</div>

				{/* Inputs */}
				<Separator text="Inputs" />
				<div className="flex flex-col gap-10 w-full">
					<InputText
						register={register}
						name="Name"
						title="Name"
						customPlaceholder="Name"
					/>

					<InputEmail name="Email" register={register} title="Email" />

					<InputPassword name="Password" register={register} title="Password" />

					<InputList
						name="role"
						title="Roles"
						register={register}
						handleChange={(value: string) => console.log(value)}
						options={[
							{
								name: 'admin',
								label: 'Admin',
							},
							{
								name: 'user',
								label: 'User',
							},
						]}
					/>
				</div>

				{/* Spinner and misc */}
				<Separator text="Spinners" />
				<div className="flex items-start gap-10">
					<div className="flex flex-col gap-2 justify-center items-center w-auto">
						<Typography type="caption-1" text="Simple" />
						<Spinner />
					</div>
					<div className="flex flex-col gap-2 justify-center items-center w-auto">
						<Typography type="caption-1" text="LoadingPage" />
						<Spinner type="loadingPage" />
					</div>
					<div className="flex flex-col gap-2 justify-center items-center w-auto">
						<Typography type="caption-1" text="Custom props" />
						<Spinner width="w-8" circleFill="grey" loadingBarFill="black" />
					</div>
					<div className="flex flex-col gap-2 justify-center items-center w-auto">
						<Typography type="caption-1" text="Color" />
						<Spinner circleFill="violet" loadingBarFill="purple" />
					</div>
				</div>

				{/* Tables */}
				<Separator text="Tables" />
				<div className="flex flex-col gap-2 justify-center align-center w-full h-auto">
					<Typography type="headline-4" text="Simple Table" />
					<Typography type="caption-3" text="Static array" />
					<SimpleTable<UserI>
						columns={[
							{
								header: 'Name',
								content: (instance) => <p>{instance.name}</p>,
							},
							{
								header: 'Username',
								content: (instance) => <p>{instance.username}</p>,
							},
							{
								header: 'Roles',
								content: (instance) => (
									<ul>
										{instance.roles.map((item) => {
											return (
												<li key={`roles-user-${instance.id}-${item}`}>
													{item}
												</li>
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
												<li key={`permissions-user-${instance.id}-${item}`}>
													{item}
												</li>
											);
										})}
									</ul>
								),
							},
						]}
						rows={DummyUsersData as UserI[]}
						rowActions={() => [
							{
								label: 'Edit',
								name: 'edit',
								icon: <PencilSquareIcon className="w-4 h-4" />,
								onClick: (instance) => {
									toast('You are editing item ' + instance.id);
								},
							},
						]}
					/>
				</div>
				<div className="flex flex-col gap-2 justify-center align-center w-full h-auto">
					<Typography type="headline-4" text="Paginated Table" />
					<Typography type="caption-3" text="Static array" />
					<PaginatedTable<UserI>
						page={1}
						pageSize={DummyUsersData.length}
						columns={[
							{
								header: 'ID',
								content: (instance) => <>{instance.id}</>,
							},
							{
								header: 'Email',
								content: (instance) => <>{instance.email}</>,
							},
							{
								header: 'Username',
								content: (instance) => <>{instance.username}</>,
							},
							{
								header: 'Name',
								content: (instance) => <>{instance.name}</>,
							},
							{
								header: 'Roles',
								content: (instance) => <>{instance.roles.join(', ')}</>,
							},
							{
								header: 'Permissions',
								content: (instance) => <>{instance.permissions.join(', ')}</>,
							},
						]}
						rows={DummyUsersData as UserI[]}
						rowActions={(instance: UserI) => {
							return [
								{
									label: 'Action 1',
									name: 'action1',
									onClick: () =>
										toast(`This Action 1 for user ${instance.name}`),
								},
								{
									label: 'Action 2',
									name: 'action2',
									onClick: () =>
										toast(`This Action 2 for user ${instance.email}`),
								},
								{
									label: 'Action 3',
									name: 'action3',
									onClick: () =>
										toast(`This Action 3 for user ${instance.username}`),
								},
							];
						}}
					/>
				</div>

				{/* Empty state */}
				<Separator text="Empty Table" />
				<div className="flex flex-col gap-2 justify-center align-center w-full h-auto">
					<EmptyState />
				</div>
			</div>
		</Layout>
	);
};

export default GuideStyles;
