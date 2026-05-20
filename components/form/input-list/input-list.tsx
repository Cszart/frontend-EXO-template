import * as React from 'react';
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react';
import { InputProps, Option } from 'interfaces';
import clsx from 'clsx';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { CypressI } from 'interfaces/cypress';

export interface InputListProps {
	options: Option[];
	handleChange?: (value: string) => void;
	myDefaultValue?: string;
}

const getDefaultValue = (options: Option[], value: string) => {
	return options.filter((opt) => opt.name === value)[0] || options[0];
};

export const InputList: React.FC<
	InputProps &
		InputListProps &
		CypressI &
		React.InputHTMLAttributes<HTMLInputElement>
> = ({
	options,
	myDefaultValue,
	className,
	handleChange,
	setValueInput,
	classNameInput = 'rounded-lg px-4 py-3',
	...props
}) => {
	const [selected, setSelected] = React.useState<Option>(
		myDefaultValue ? getDefaultValue(options, myDefaultValue) : options[0]
	);

	React.useEffect(() => {
		handleChange && handleChange(selected.name);
		setValueInput && setValueInput(props.name, selected.name);
	}, [selected]);

	return (
		<div className={clsx(className)}>
			<input
				type="text"
				className="hidden"
				value={selected.name}
				{...props.register(props.name, props.rules)}
			/>
			<Listbox value={selected} onChange={setSelected}>
				{({ open }) => (
					<>
						<ListboxLabel className="block">
							<label htmlFor="name" className="text-xs text-dark-100">
								{props.title}
							</label>
						</ListboxLabel>
						<div className="relative">
							<ListboxButton
								className={clsx(
									'relative w-full text-left cursor-pointer border flex focus:outline-none',
									!selected.placeholder && 'capitalize',
									classNameInput
								)}
							>
								<span className="flex items-center">
									<span
										className={clsx('block truncate text-xs text-dark-100', {
											'text-dark-40': selected.placeholder,
										})}
									>
										{selected.label}
									</span>
								</span>
								<span
									className={clsx(
										'absolute inset-y-0 right-4 flex items-center ml-3 pointer-events-none'
									)}
								>
									<ChevronDownIcon
										width={20}
										height={14}
										className="text-dark-100"
									/>
								</span>
							</ListboxButton>
							<Transition
								show={open}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<ListboxOptions
									className={clsx(
										{ hidden: props.disabled },
										'max-h-72',
										'absolute z-20 w-full bg-white border rounded-lg focus:outline-none shadow-lg overflow-auto'
									)}
								>
									{options.map(
										(option) =>
											!option.placeholder && (
												<ListboxOption
													key={option.name}
													className={({ active, selected }) =>
														clsx(
															(selected || active) && 'font-bold bg-dark-10',
															'relative px-4 py-2 cursor-pointer select-none capitalize'
														)
													}
													value={option}
												>
													{({ selected }) => (
														<div className="flex items-center">
															<span className="block truncate text-xs text-dark-100">
																{option.label}
															</span>

															{selected ? (
																<span className="absolute right-0 pr-4">
																	<CheckIcon
																		className="w-5 h-5 text-dark-100"
																		aria-hidden="true"
																	/>
																</span>
															) : null}
														</div>
													)}
												</ListboxOption>
											)
									)}
								</ListboxOptions>
							</Transition>
						</div>
					</>
				)}
			</Listbox>
		</div>
	);
};
