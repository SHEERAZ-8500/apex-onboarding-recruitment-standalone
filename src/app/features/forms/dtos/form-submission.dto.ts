export class FormSubmissionDto {
  publicId!: string;
  formDefinitionPublicId!: string;
  formName!: string;
  submittedAt!: string;
  submittedBy!: string;

  constructor(data?: Partial<FormSubmissionDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
