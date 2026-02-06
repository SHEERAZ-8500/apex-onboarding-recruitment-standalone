export class AllFormsListingDto {
  createdDate: string;
  name: string;
  publicId: string;
  version: number;
  status: string;

  constructor(createdDate: string, name: string, publicId: string, version: number, status: string) {
    this.createdDate = createdDate;
    this.name = name;
    this.publicId = publicId;
    this.version = version;
    this.status = status;
  }
}
