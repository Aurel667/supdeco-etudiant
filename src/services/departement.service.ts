import { apiGetAllDepartements } from "../api/departement.api";

const departementService = {
    getAllDepartements: async () => {
        const data = await apiGetAllDepartements();
        return data;
    }
}

export default departementService;