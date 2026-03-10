import client from "../config/api-client.config";

export async function apiGetAllDepartements() {
    const {data} = await client.get("/parametrages/departements/all_departement");
    return data
}