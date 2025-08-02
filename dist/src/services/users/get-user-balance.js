import { UserNotFoundError } from "@/errors/user";
export class GetUserBalanceService {
    getUserByIdRepository;
    getUserBalanceRepository;
    constructor(getUserByIdRepository, getUserBalanceRepository) {
        this.getUserByIdRepository = getUserByIdRepository;
        this.getUserBalanceRepository = getUserBalanceRepository;
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const userBalance = await this.getUserBalanceRepository.execute(params.userId);
        return userBalance;
    }
}
