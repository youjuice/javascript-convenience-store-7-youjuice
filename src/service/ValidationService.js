import {validator} from "../utils/validator.js";

class ValidationService {
    constructor(outputView) {
        this.outputView = outputView;
    }

    async validateYesNo(input) {
        try {
            const validAnswer = validator.validateYesNo(input);
            return validAnswer === 'Y';
        } catch (error) {
            this.outputView.printError(error.message);
            throw error;
        }
    }
}

export default ValidationService;