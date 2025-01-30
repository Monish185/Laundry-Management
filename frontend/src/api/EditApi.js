import axios from 'axios';


const BASE_URL = "http://127.0.0.1:8000/laundry"; // Django backend URL

export const editParticulars = async (slipId, updatedParticulars) => {
    try {
        const response = await axios.post(`${BASE_URL}/edit-particulars/${slipId}/`, {
            particulars: updatedParticulars,
        });
        return response.data;
    } catch (error) {
        console.error("Error editing particulars:", error);
        throw error;
    }
};
