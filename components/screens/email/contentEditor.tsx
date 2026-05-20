import * as React from 'react';
import parse from 'html-react-parser';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

import { Layout } from 'components/layout';
import { Button, Tabs, Typography } from 'components/common';
import { useRouter } from 'next/router';
import { EmailTemplateI } from 'interfaces';
import SimpleTextEditor from 'components/text-editor/textEditor';
import { emailService } from 'api_services';
import useModal from 'hooks/useModal';
import { InputText } from 'components/form';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

const saveHtmlToFile = (htmlContent: string, fileName: string): void => {
	const blob = new Blob([htmlContent], { type: 'text/html' });
	saveAs(blob, fileName);
};

const EmailContentEditorScreen = (): JSX.Element => {
	// Utils
	const router = useRouter();
	const { editMode } = router.query;
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors, isDirty, isValid },
	} = useForm({
		mode: 'onChange',
	});

	const [currentOption, setCurrentOption] = React.useState<
		'email_content' | 'preview_content'
	>('email_content');

	// Data
	const [templateName, setTemplateName] = React.useState<string>('');
	const [previewContent, setPreviewContent] = React.useState<string>();
	const [defaultHtml, setDefaultHtml] = React.useState<string | undefined>(
		undefined
	);

	const {
		Modal: ModalSaveTemplate,
		show: showSaveTemplate,
		hide: hideSaveTemplate,
	} = useModal();

	// Rules
	const rules = {
		name: {
			required: { value: true, message: 'This is requeried' },
		},
	};

	// Function to handle create or update template name
	const handleShowModal = (): void => {
		if (editMode === 'true') {
			// Retrieve the JSON object from local storage
			const stringTemplateToEdit = localStorage.getItem('templateToEdit');

			if (stringTemplateToEdit) {
				const templateToEditContent: EmailTemplateI =
					JSON.parse(stringTemplateToEdit);
				setValue('name', templateToEditContent.name, {
					shouldDirty: true,
					shouldValidate: true,
				});
				showSaveTemplate();
			}
		} else {
			showSaveTemplate();
		}
	};

	// Function to handle update and save templates
	const handleSaveTemplate = async (data: any): Promise<void> => {
		setIsLoading(true);
		try {
			// Update template logic
			if (editMode === 'true') {
				// Retrieve the JSON object from local storage
				const stringTemplateToEdit = localStorage.getItem('templateToEdit');

				// Double check the item stored
				if (stringTemplateToEdit) {
					// Parse item stored
					const templateToEditContent: EmailTemplateI =
						JSON.parse(stringTemplateToEdit);

					// Call backend with new information and template id
					const updateResponse = await emailService.updateTemplate(
						templateToEditContent.id,
						{
							name: data.name, // Template name
							content: previewContent,
						}
					);

					if (updateResponse.status == 200) {
						toast.success('Template updated succesfully!');
					}
				}

				// Create template logic
			} else {
				if (previewContent) {
					console.log(previewContent);
					// Call backend with new information and template id
					const createResponse = await emailService.createTemplate({
						name: data.name, // Template name
						content: previewContent,
					});

					if (createResponse.status == 200) {
						toast.success('Template created succesfully!');
					}
				}
			}

			setIsLoading(false);
			hideSaveTemplate();
			reset();
		} catch (error) {
			console.error('Error updating template:', error);
			setIsLoading(false);
			toast.error('Error updating template. Please try again.');
		}
	};

	// -- Use effects
	// Get the template to edit from local Storage
	// Note: Implementation might change depending on the project
	React.useEffect(() => {
		if (editMode === 'true') {
			// Retrieve the JSON object from local storage
			const stringTemplateToEdit = localStorage.getItem('templateToEdit');

			if (stringTemplateToEdit) {
				// Use the JSON object as needed
				const templateToEditContent: EmailTemplateI =
					JSON.parse(stringTemplateToEdit);
				setPreviewContent(templateToEditContent.content);
				setDefaultHtml(templateToEditContent.content);
				setTemplateName(templateToEditContent.name);
			}
		}
	}, [editMode]);

	return (
		<Layout withHeader title="Content editor for Email">
			{/* Download HTML button */}
			<div
				className={clsx(
					'flex w-full items-center mb-10',
					templateName ? 'justify-between' : 'justify-end'
				)}
			>
				{templateName && (
					<Typography type="custom-h4" className="font-bold">
						Name: {templateName}
					</Typography>
				)}
				<Button
					label="Download"
					decoration="not-fill"
					size="extra-small"
					iconRight
					icon={<ArrowDownTrayIcon className="w-6 h-6" />}
					className="rounded-[32px]"
					onClick={() => saveHtmlToFile(previewContent ?? '', 'template.html')}
				/>
			</div>

			{/* Page content - Two columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
				{/* First column - Editor */}
				<div className="flex flex-col gap-2 w-full">
					<Typography type="link-1" text="Editor" className="mb-2 text-left" />

					<SimpleTextEditor
						onChange={(html: string) => {
							setPreviewContent(html);
						}}
						defaultHtml={defaultHtml}
					/>
				</div>

				{/* Second column - Preview and actions */}
				<div className="flex flex-col gap-2 w-full">
					{/* Option bar */}
					<div className="flex flex-wrap items-center justify-between gap-4 w-full">
						{/* Tabs */}
						<Tabs
							currentOption={currentOption}
							setCurrentOption={(value) =>
								setCurrentOption(value as 'preview_content' | 'email_content')
							}
							optionsTabs={[
								{
									label: 'Email preview',
									name: 'email_content',
								},
								{
									label: 'Preview raw content',
									name: 'preview_content',
								},
							]}
						/>
					</div>

					<div className="border rounded-lg border-dark-40 h-full min-h-[400px] p-4">
						{currentOption === 'email_content'
							? parse(previewContent ?? '')
							: previewContent}
					</div>
				</div>
			</div>

			{/* Save button */}
			<div className="flex w-full justify-end md:mt-10">
				<Button
					label="Save changes"
					decoration="line-primary"
					size="extra-small"
					onClick={handleShowModal}
				/>
			</div>

			<ModalSaveTemplate title="Template name">
				<form className="mt-4" onSubmit={handleSubmit(handleSaveTemplate)}>
					<InputText
						register={register}
						name="name"
						title="Name"
						customPlaceholder="Name"
						rules={rules.name}
						error={errors.name}
					/>
					<div className="flex gap-x-4 w-full justify-center mt-8">
						<Button
							label="Cancel"
							decoration="line-primary"
							size="extra-small"
							type="button"
							onClick={() => {
								hideSaveTemplate();
								reset();
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
			</ModalSaveTemplate>
		</Layout>
	);
};

export default EmailContentEditorScreen;
