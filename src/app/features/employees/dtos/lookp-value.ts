export class LookupValueDto {
    code: string = '';
    description: string = '';
    isActive: boolean = true;
    name: string = '';
    publicId: string = '';

    constructor(init?: Partial<LookupValueDto>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}