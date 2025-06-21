// services/userService.ts
import api from '../../../api';
import type { UserFormType } from '../schemas/userSchema';
import { userSchema } from '../schemas/userSchema';

const context = 'register/'

export const registerUser = async (data: UserFormType): Promise<UserFormType> => {
    // Validate and transform the data according to the schema
    const parsedData = userSchema.parse(data);

    // Make the POST request using the validated data
    const response = await api.post<UserFormType>(context, parsedData);
    return response.data;
}
