import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/laundry";

export const CreateApi = async (studentId,particulars) => {
    try {
        const res = await axios.post(`${BASE_URL}/create-slip/`,{
            student_id: studentId,
            particulars: particulars
        });
        return res.data;
    }catch(e){
        alert("Error cannot create slip");
        throw e;
    }
}