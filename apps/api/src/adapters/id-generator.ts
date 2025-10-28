import { v4 as uuidv4 } from 'uuid'

export class IdGeneratorAdapter {
    execute(): string {
        return uuidv4()
    }
}
