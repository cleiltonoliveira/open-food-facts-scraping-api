export default class BadRequestException extends Error {
    constructor(mensagem: any) {
        super(mensagem);
        this.name = 'BadRequestException';
    }
}