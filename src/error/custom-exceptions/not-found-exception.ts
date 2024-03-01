export default class NotFoundException extends Error {
    constructor(mensagem: any) {
        super(mensagem);
        this.name = 'NotFoundException';
    }
}